const admin = require('firebase-admin');
const functions = require('firebase-functions');

const { generateTag } = require('./utils');

module.exports = functions.auth.user().onCreate(async user => {
  const { email } = user;
  const username = email.split('@')[0];
  let tag;

  let isUnique = false;
  while (!isUnique) {
    tag = generateTag();
    // eslint-disable-next-line no-await-in-loop
    const doc = await admin
      .firestore()
      .collection('users')
      .where('username', '==', username)
      .where('tag', '==', tag)
      .get();

    isUnique = doc.empty;
  }

  await admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({ email, username, tag });
});
