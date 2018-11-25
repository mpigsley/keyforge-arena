const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = functions.https.onCall(async ({ connection }, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.',
    );
  }

  try {
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
    throw new functions.https.HttpsError(
      'unknown',
      'Could not request connection.',
    );
  }
});
