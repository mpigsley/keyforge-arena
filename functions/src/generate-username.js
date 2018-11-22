const admin = require('firebase-admin');
const functions = require('firebase-functions');

module.exports = functions.auth.user().onCreate(async user => {
  const { email } = user;
  const username = email.split('@')[0];

  await admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({ username });
});
