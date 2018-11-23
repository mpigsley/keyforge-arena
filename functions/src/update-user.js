const admin = require('firebase-admin');
const functions = require('firebase-functions');

const { generateTag } = require('./utils');

module.exports = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const previousValue = change.before.data();
    const { username, tag } = change.after.data();
    if (username === previousValue.username) {
      return;
    }

    let failSafe = 0;
    let tagHash = tag || generateTag();
    let isUnique = false;
    const { userId } = context.params;

    while (!isUnique && failSafe < 5) {
      // eslint-disable-next-line no-await-in-loop
      const snapshot = await admin
        .firestore()
        .collection('users')
        .where('username', '==', username || '')
        .where('tag', '==', tagHash)
        .get();

      isUnique = snapshot.docs.filter(doc => doc.id !== userId).length === 0;
      failSafe += 1;
      if (!isUnique) {
        tagHash = generateTag();
      }
    }

    if (tagHash === tag) {
      return;
    }

    await admin
      .firestore()
      .collection('users')
      .doc(userId)
      .set({ tag: tagHash }, { merge: true });
  });
