const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = functions.https.onCall(
  async ({ connnection, accepted }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.',
      );
    }

    try {
      const batch = admin.firestore().batch();
      if (accepted) {
        batch.set(
          admin
            .firestore()
            .collection('connections')
            .doc(context.auth.uid),
          {
            pending: admin.firestore.FieldValue.arrayRemove(connnection),
            active: admin.firestore.FieldValue.arrayUnion(connnection),
          },
          { merge: true },
        );
        batch.set(
          admin
            .firestore()
            .collection('connections')
            .doc(connection),
          { active: admin.firestore.FieldValue.arrayUnion(context.auth.uid) },
          { merge: true },
        );
      } else {
        batch.set(
          admin
            .firestore()
            .collection('connections')
            .doc(context.auth.uid),
          { pending: admin.firestore.FieldValue.arrayRemove(connnection) },
          { merge: true },
        );
      }
      await batch.commit();
    } catch (e) {
      console.error(e);
      throw new functions.https.HttpsError(
        'unknown',
        'Could not reply to connection request.',
      );
    }
  },
);
