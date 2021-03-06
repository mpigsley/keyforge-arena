const admin = require('firebase-admin');
const functions = require('firebase-functions');

const { generateTag, firestore } = require('../utils/common');

module.exports = functions.auth.user().onCreate(async user => {
  const { email } = user;
  const username = email.split('@')[0].replace(/\W/g, '');
  let tag;

  let isUnique = false;
  let failSafe = 0;
  while (!isUnique && failSafe < 5) {
    tag = generateTag();
    // eslint-disable-next-line no-await-in-loop
    const doc = await firestore
      .collection('users')
      .where('username', '==', username)
      .where('tag', '==', tag)
      .get();

    isUnique = doc.empty;
    failSafe += 1;
  }

  const batch = firestore.batch();
  batch.set(firestore.collection('users').doc(user.uid), { username, tag });
  batch.set(firestore.collection('user-search').doc(user.uid), {
    email,
    username: `${username}#${tag}`,
  });
  await batch.commit();
});
