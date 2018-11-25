const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.',
    );
  }

  try {
    // Update current user's last online time
    // Grab connection list
    // Create map of connection uid to last online and return that
  } catch (e) {
    console.error(e);
    throw new functions.https.HttpsError(
      'unknown',
      'Error updating online state',
    );
  }
});
