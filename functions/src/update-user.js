const functions = require('firebase-functions');

const { generateTag, firestore } = require('../utils/common');

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
      const snapshot = await firestore
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

    const batch = firestore.batch();
    if (tagHash === tag) {
      batch.set(
        firestore.collection('users').doc(userId),
        { tag: tagHash },
        { merge: true },
      );
    }

    batch.set(
      firestore.collection('user-search').doc(userId),
      { username: `${username}#${tag}` },
      { merge: true },
    );

    await batch.commit();
  });
