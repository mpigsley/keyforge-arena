const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { includes } = require('lodash');

module.exports = functions.https.onCall(async ({ connection }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.',
    );
  }

  try {
    const existing = await admin
      .firestore()
      .collection('connection')
      .doc(connection)
      .get();

    if ((includes((existing || {}).active || []), context.auth.uid)) {
      throw new functions.https.HttpsError(
        'already-exists',
        'Connection already exists.',
      );
    }

    await admin
      .firestore()
      .collection('connections')
      .doc(connection)
      .set(
        { pending: admin.firestore.FieldValue.arrayUnion(context.auth.uid) },
        { merge: true },
      );
  } catch (e) {
    console.error(e);
    if (e.code === 'already-exists') {
      throw e;
    }
    throw new functions.https.HttpsError(
      'unknown',
      'Could not request connection.',
    );
  }
});
