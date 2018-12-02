const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { flatten, uniq } = require('lodash');

module.exports = functions.https.onCall(async ({ lobby }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.',
    );
  } else if (!lobby) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'A reference to the lobby must be given ',
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

    batch.set(
      admin
        .firestore()
        .collection('games')
        .doc(),
      {
        created: admin.firestore.FieldValue.serverTimestamp(),
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
