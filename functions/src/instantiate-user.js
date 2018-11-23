const admin = require('firebase-admin');
const functions = require('firebase-functions');

const { generateTag } = require('./utils');

module.exports = functions.auth.user().onCreate(async user => {
  const { email } = user;
  const username = email.split('@')[0];
  let tag;

  let isUnique = false;
  let failSafe = 0;
  while (!isUnique && failSafe < 5) {
    tag = generateTag();
    // eslint-disable-next-line no-await-in-loop
    const doc = await admin
      .firestore()
      .collection('users')
      .where('username', '==', username)
      .where('tag', '==', tag)
      .get();

    isUnique = doc.empty;
    failSafe += 1;
  }

  await admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({ email, username, tag });
});