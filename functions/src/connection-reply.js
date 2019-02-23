const admin = require('firebase-admin');
const functions = require('firebase-functions');

const { firestore } = require('../utils/common');

module.exports = functions.https.onCall(
  async ({ connection, accepted }, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.',
      );
    } else if (!connection || accepted === undefined) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        "The connection's id and whether or not they are accepted is required",
      );
    }

    try {
      const batch = firestore.batch();
      if (accepted) {
        batch.set(
          firestore.collection('connections').doc(context.auth.uid),
          {
            pending: admin.firestore.FieldValue.arrayRemove(connection),
            active: admin.firestore.FieldValue.arrayUnion(connection),
          },
          { merge: true },
        );
        batch.set(
          firestore.collection('connections').doc(connection),
          { active: admin.firestore.FieldValue.arrayUnion(context.auth.uid) },
          { merge: true },
        );
      } else {
        batch.set(
          firestore.collection('connections').doc(context.auth.uid),
          { pending: admin.firestore.FieldValue.arrayRemove(connection) },
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
