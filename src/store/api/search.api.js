import Firebase from 'firebase/app';

// eslint-disable-next-line import/prefer-default-export
export const searchForUser = (search, userId) =>
  Promise.all([
    Firebase.firestore()
      .collection('user-search')
      .where('email', '==', search)
      .get(),
    Firebase.firestore()
      .collection('user-search')
      .where('username', '==', search)
      .get(),
  ]).then(([email, username]) => {
    const docs = [...email.docs, ...username.docs].filter(
      doc => doc.id !== userId,
    );
    let uid;
    if (docs.length) {
      uid = docs[0].id;
    }
    return uid;
  });
