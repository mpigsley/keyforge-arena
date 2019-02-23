const admin = require('firebase-admin');
const functions = require('firebase-functions');
const chance = require('chance').Chance();
const {
  flatten,
  uniq,
  sortBy,
  findKey,
  reduce,
  take,
  drop,
} = require('lodash');

const { firestore } = require('../utils/common');

const initialSharedState = () => ({
  keyCost: 6,
  archiveSize: 0,
  house: '',
  turn: 0,
  aember: 0,
  keys: 0,
  artifacts: [],
  battlelines: [],
  purged: [],
  discard: [],
});

const createDeck = ({ expansion, houses }) =>
  reduce(
    houses,
    (arr, cards, house) => [
      ...arr,
      ...cards.map(card => `${expansion}-${house}-${card}`),
    ],
    [],
  );

const shuffleAndDrawHand = (deck, handSize) => {
  const shuffledDeck = chance.shuffle(createDeck(deck));
  return [take(shuffledDeck, handSize), drop(shuffledDeck, handSize)];
};

module.exports = functions.https.onCall(async ({ lobby, deck }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.',
    );
  } else if (!lobby) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'A reference to the lobby must be given.',
    );
  } else if (!deck) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'A reference to active deck must be given.',
    );
  }

  try {
    const lobbyDoc = await firestore
      .collection('lobby')
      .doc(lobby)
      .get();

    if (!lobbyDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Lobby was not found.');
    }

    const { players } = lobbyDoc.data();
    const playerLobbies = await Promise.all(
      players.map(uid =>
        firestore
          .collection('lobby')
          .where('players', 'array-contains', uid)
          .get(),
      ),
    );

    const lobbyIds = uniq(
      flatten(playerLobbies.map(snapshot => snapshot.docs.map(doc => doc.id))),
    );
    await Promise.all(
      lobbyIds.map(id =>
        firestore
          .collection('lobby')
          .doc(id)
          .delete(),
      ),
    );

    const opponent = players.filter(uid => uid !== context.auth.uid)[0];
    const [opponentDeckSnapshot, playerDeckSnapshot] = await Promise.all([
      firestore
        .collection('decks')
        .where('creator', '==', opponent)
        .get(),
      firestore
        .collection('decks')
        .doc(deck)
        .get(),
    ]);

    let playerDeck;
    if (playerDeckSnapshot.exists) {
      playerDeck = playerDeckSnapshot.data();
    } else {
      throw new functions.https.HttpsError('not-found', 'Deck was not found.');
    }

    let opponentDecks = {};
    opponentDeckSnapshot.forEach(doc => {
      opponentDecks = {
        ...opponentDecks,
        [doc.id]: doc.data(),
      };
    });

    let opponentDeckId = findKey(opponentDecks, { selected: true });
    if (!opponentDeckId) {
      const { deckId } = sortBy(opponentDecks, 'name')[0];
      opponentDeckId = findKey(opponentDecks, { deckId });
    }

    if (!opponentDeckId) {
      throw new functions.https.HttpsError(
        'not-found',
        'Opponent deck was not found.',
      );
    }

    const firstPlayer = chance.pickone(players);
    const playerHandSize = firstPlayer === context.auth.uid ? 7 : 6;
    const opponentHandSize = firstPlayer === opponent ? 7 : 6;
    const [playerHand, shuffledPlayerDeck] = shuffleAndDrawHand(
      playerDeck,
      playerHandSize,
    );
    const [opponentHand, shuffledOpponentDeck] = shuffleAndDrawHand(
      opponentDecks[opponentDeckId],
      opponentHandSize,
    );
    const gameRef = firestore.collection('games').doc();

    await Promise.all([
      firestore
        .collection('games')
        .doc(gameRef.id)
        .collection('state')
        .doc(context.auth.uid)
        .set({ hand: playerHand, archived: [] }),
      firestore
        .collection('games')
        .doc(gameRef.id)
        .collection('protected')
        .doc(context.auth.uid)
        .set({ deck: shuffledPlayerDeck }),
      firestore
        .collection('games')
        .doc(gameRef.id)
        .collection('state')
        .doc(opponent)
        .set({ hand: opponentHand, archived: [] }),
      firestore
        .collection('games')
        .doc(gameRef.id)
        .collection('protected')
        .doc(opponent)
        .set({ deck: shuffledOpponentDeck }),
      gameRef.set({
        created: admin.firestore.FieldValue.serverTimestamp(),
        isFinished: false,
        turn: firstPlayer,
        state: {
          [context.auth.uid]: {
            ...initialSharedState(),
            handSize: playerHandSize,
            deckSize: 36 - playerHandSize,
            deck,
          },
          [opponent]: {
            ...initialSharedState(),
            handSize: opponentHandSize,
            deckSize: 36 - opponentHandSize,
            deck: opponentDeckId,
          },
        },
        players,
      }),
    ]);
  } catch (e) {
    console.error(e);
    if (e.code === 'not-found') {
      throw e;
    }
    throw new functions.https.HttpsError('unknown', 'Could not create game.');
  }
});
