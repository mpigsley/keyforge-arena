const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { flatten, uniq, sortBy, size, findKey, map } = require('lodash');

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
    const lobbyDoc = await admin
      .firestore()
      .collection('lobby')
      .doc(lobby)
      .get();

    if (!lobbyDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Lobby was not found.');
    }

    const { players } = lobbyDoc.data();
    const playerLobbies = await Promise.all(
      players.map(uid =>
        admin
          .firestore()
          .collection('lobby')
          .where('players', 'array-contains', uid)
          .get(),
      ),
    );

    const batch = admin.firestore().batch();
    const lobbyIds = uniq(
      flatten(playerLobbies.map(snapshot => snapshot.docs.map(doc => doc.id))),
    );
    lobbyIds.forEach(id =>
      batch.delete(
        admin
          .firestore()
          .collection('lobby')
          .doc(id),
      ),
    );

    const opponent = players.filter(uid => uid !== context.auth.uid)[0];
    const deckSnapshot = await admin
      .firestore()
      .collection('decks')
      .where('creator', '==', opponent)
      .get();

    let opponentDecks = {};
    deckSnapshot.forEach(doc => {
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

    batch.set(
      admin
        .firestore()
        .collection('games')
        .doc(),
      {
        created: admin.firestore.FieldValue.serverTimestamp(),
        decks: {
          [context.auth.uid]: deck,
          [opponent]: opponentDeckId,
        },
        players,
      },
    );

    await batch.commit();
  } catch (e) {
    console.error(e);
    if (e.code === 'not-found') {
      throw e;
    }
    throw new functions.https.HttpsError('unknown', 'Could not create game.');
  }
});
