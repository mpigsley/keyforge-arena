import Firebase from 'firebase/app';
import dayjs from 'dayjs';

export const createGame = (lobby, deck) =>
  Firebase.functions().httpsCallable('createGame')({ lobby, deck });

export const getGame = id =>
  Firebase.firestore()
    .collection('games')
    .doc(id)
    .get()
    .then(doc => doc.data());

export const getPersonalGameState = (uid, gameId) =>
  Firebase.firestore()
    .collection('games')
    .doc(gameId)
    .collection('personal')
    .doc(uid)
    .get();

export const gameListener = (uid, cb) =>
  Firebase.firestore()
    .collection('games')
    .where('players', 'array-contains', uid)
    .where(
      'created',
      '>',
      dayjs()
        .subtract(2, 'week')
        .toDate(),
    )
    .onSnapshot(snapshot => {
      let update = {};
      let deleted = [];
      const personalStatePromises = [];
      snapshot.docChanges().forEach(change => {
        if (change.type === 'removed') {
          deleted = [...deleted, change.doc.id];
        } else {
          personalStatePromises.push(getPersonalGameState(uid, change.doc.id));
          update = {
            ...update,
            [change.doc.id]: change.doc.data(),
          };
        }
      });

      Promise.all(personalStatePromises).then(personalStates => {
        const personal = personalStates.reduce(
          (obj, state) => ({ ...obj, [state.id]: state.data() }),
          {},
        );
        cb({ update, deleted, personal });
      });
    });

export const handleGameAction = (game, action, metadata) =>
  Firebase.functions().httpsCallable('handleGameAction')({
    game,
    action,
    metadata,
  });
