import Firebase from 'firebase/app';

// eslint-disable-next-line
export const getGame = id =>
  Firebase.firestore()
    .collection('games')
    .doc(id)
    .get()
    .then(doc => doc.data());
