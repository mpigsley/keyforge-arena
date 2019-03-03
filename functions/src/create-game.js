const admin = require('firebase-admin');
const functions = require('firebase-functions');

const {
  firestore,
  chance,
  shuffleAndDrawHand,
  createDeck,
} = require('../utils/common');

const initialSharedState = () => ({
  keyCost: 6,
  maxHandSize: 6,
  archiveSize: 0,
  house: '',
  turn: 0,
  aember: 0,
  keys: 0,
  chain: 0,
  artifacts: [],
  battleline: [],
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
    const lobbySnapshot = await firestore
      .collection('lobby')
      .doc(lobby)
      .get();

    if (!lobbySnapshot.exists) {
      throw new functions.https.HttpsError('not-found', 'Lobby was not found.');
    }
    const lobbyDoc = lobbySnapshot.data();

    const opponent = lobbyDoc.players.filter(
      uid => uid !== context.auth.uid,
    )[0];
    const [opponentDeckSnapshot, playerDeckSnapshot] = await Promise.all([
      firestore
        .collection('decks')
        .doc(lobbyDoc.deck)
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

    const firstPlayer = chance.pickone(lobbyDoc.players);
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
          deck: lobbyDoc.deck,
        },
      },
      players: lobbyDoc.players,
    });

    // Do this last to avoid a race condition
    await firestore
      .collection('lobby')
      .doc(lobby)
      .set({ game: gameRef.id }, { merge: true });

    return gameRef.id;
  } catch (e) {
    console.error(e);
    if (e.code === 'not-found') {
      throw e;
    }
    throw new functions.https.HttpsError('unknown', 'Could not create game.');
  }
});
