const admin = require('firebase-admin');
const functions = require('firebase-functions');

const { flatten, uniq, sortBy, findKey } = require('../constants/lodash');
const {
  firestore,
  chance,
  shuffleAndDrawHand,
  createDeck,
} = require('../utils/common');

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
    const lobby = lobbyDoc.data();

    const opponent = lobby.players.filter(uid => uid !== context.auth.uid)[0];
    const [opponentDeckSnapshot, playerDeckSnapshot] = await Promise.all([
      firestore
        .collection('decks')
        .doc(lobby.deck)
        .get(),
      firestore
        .collection('decks')
        .doc(deck)
        .get(),
    ]);

    let playerDeck;
    if (playerDeckSnapshot.exists) {
      playerDeck = playerDeckSnapshot.data();
    }
    let opponentDeck;
    if (opponentDeckSnapshot.exists) {
      opponentDeck = opponentDeckSnapshot.data();
    }
    if (!playerDeck || !opponentDeck) {
      throw new functions.https.HttpsError('not-found', 'Deck was not found.');
    }

    const firstPlayer = chance.pickone(lobby.players);
    const playerHandSize = firstPlayer === context.auth.uid ? 7 : 6;
    const opponentHandSize = firstPlayer === opponent ? 7 : 6;
    const [playerHand, shuffledPlayerDeck] = shuffleAndDrawHand(
      createDeck(playerDeck),
      playerHandSize,
    );
    const [opponentHand, shuffledOpponentDeck] = shuffleAndDrawHand(
      createDeck(opponentDeck),
      opponentHandSize,
    );

    const gameRef = firestore.collection('games').doc();
    const batch = firestore.batch();
    batch.set(
      firestore
        .collection('games')
        .doc(gameRef.id)
        .collection('personal')
        .doc(context.auth.uid),
      { hand: playerHand, archived: [] },
    );
    batch.set(
      firestore
        .collection('games')
        .doc(gameRef.id)
        .collection('hidden')
        .doc(context.auth.uid),
      { deck: shuffledPlayerDeck },
    );
    batch.set(
      firestore
        .collection('games')
        .doc(gameRef.id)
        .collection('personal')
        .doc(opponent),
      { hand: opponentHand, archived: [] },
    );
    batch.set(
      firestore
        .collection('games')
        .doc(gameRef.id)
        .collection('hidden')
        .doc(opponent),
      { deck: shuffledOpponentDeck },
    );

    // Cleanup old lobbies
    const playerLobbies = await Promise.all(
      lobby.players.map(uid =>
        firestore
          .collection('lobby')
          .where('players', 'array-contains', uid)
          .get(),
      ),
    );
    const lobbyIds = uniq(
      flatten(playerLobbies.map(snapshot => snapshot.docs.map(doc => doc.id))),
    );
    lobbyIds.map(id => batch.delete(firestore.collection('lobby').doc(id)));

    await batch.commit();

    // Create game last because client will try to get personal objects immediately afterword
    await gameRef.set({
      created: admin.firestore.FieldValue.serverTimestamp(),
      isFinished: false,
      turn: firstPlayer,
      lobby,
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
          deck: lobby.deck,
        },
      },
      players: lobby.players,
    });

    return gameRef.id;
  } catch (e) {
    console.error(e);
    if (e.code === 'not-found') {
      throw e;
    }
    throw new functions.https.HttpsError('unknown', 'Could not create game.');
  }
});
