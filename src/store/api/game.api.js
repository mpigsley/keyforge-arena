import Firebase from 'firebase/app';
import dayjs from 'dayjs';

export const createGame = challenge =>
  Firebase.functions().httpsCallable('createGame')({
    challenge,
  });

export const getGame = id =>
  Firebase.firestore()
    .collection('games')
    .doc(id)
    .get()
    .then(doc => doc.data());

export const gameListener = (uid, cb) =>
  Firebase.firestore()
    .collection('game')
    .where('players', 'array-contains', uid)
    .where(
      'created',
      '>',
      dayjs()
        .subtract(2, 'minute')
        .toDate(),
    )
    .onSnapshot(snapshot => {
      let update = {};
      let deleted = [];
      snapshot.docChanges().forEach(change => {
        if (change.type === 'removed') {
          deleted = [...deleted, change.doc.id];
        } else {
          update = {
            ...update,
            [change.doc.id]: change.doc.data(),
          };
        }
      });
      cb({ update, deleted });
    });
