const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { includes } = require('lodash');

const { firestore } = require('../utils/common');

module.exports = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.',
    );
  }

  try {
    const [user, connections] = await Promise.all([
      firestore
        .collection('users')
        .doc(context.auth.uid)
        .get(),
      firestore
        .collection('connections')
        .doc(context.auth.uid)
        .get(),
    ]);

    const userObj = user.data();
    if (!userObj) {
      return {}; // Hasn't been created yet
    }

    const { tag, username } = userObj;
    const { pending, active } = connections.exists ? connections.data() : {};
    const allConnections = [...(pending || []), ...(active || [])];

    const [connectionUsers] = await Promise.all([
      Promise.all(
        allConnections.map(uid =>
          firestore
            .collection('status')
            .doc(uid)
            .get(),
        ),
      ),
      firestore
        .collection('status')
        .doc(context.auth.uid)
        .set({
          tag,
          username,
          online: admin.firestore.FieldValue.serverTimestamp(),
        }),
    ]);

    return connectionUsers.reduce(
      (mapping, connection) => ({
        ...mapping,
        [connection.id]: {
          ...connection.data(),
          online: connection
            .get('online')
            .toDate()
            .valueOf(),
          pending: includes(pending, connection.id),
        },
      }),
      {},
    );
  } catch (e) {
    console.error(e);
    throw new functions.https.HttpsError(
      'unknown',
      'Error updating online state',
    );
  }
});
