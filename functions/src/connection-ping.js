const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { includes } = require('lodash');

module.exports = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.',
    );
  }

  try {
    const [user, connections] = await Promise.all([
      admin
        .firestore()
        .collection('users')
        .doc(context.auth.uid)
        .get(),
      admin
        .firestore()
        .collection('connections')
        .doc(context.auth.uid)
        .get(),
    ]);

    const { tag, username } = user.data();
    const { pending, active } = connections.exists ? connections.data() : {};
    const allConnections = [...(pending || []), ...(active || [])];

    const [connectionUsers] = await Promise.all([
      Promise.all(
        allConnections.map(uid =>
          admin
            .firestore()
            .collection('status')
            .doc(uid)
            .get(),
        ),
      ),
      admin
        .firestore()
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
