import Firebase from 'firebase/app';

export const createGame = (lobby, deck) =>
  Firebase.functions()
    .httpsCallable('createGame')({ lobby, deck })
    .then(response => response.data);

export const getPersonalGameState = (uid, gameId) =>
  Firebase.firestore()
    .collection('games')
    .doc(gameId)
    .collection('personal')
    .doc(uid)
    .get();

const modifyWithPersonal = (uid, gameId, gameDoc) =>
  getPersonalGameState(uid, gameId).then(personalDoc => {
    const game = gameDoc.data();
    return {
      gameId,
      game: {
        ...game,
        state: {
          ...game.state,
          [uid]: { ...game.state[uid], ...personalDoc.data() },
        },
      },
    };
  });

export const getGame = (gameId, uid) =>
  Firebase.firestore()
    .collection('games')
    .doc(gameId)
    .get()
    .then(doc => {
      if (doc.exists) {
        return modifyWithPersonal(uid, gameId, doc);
      }
      return undefined;
    });

export const gameListener = (gameId, uid, cb) =>
  Firebase.firestore()
    .collection('games')
    .doc(gameId)
    .onSnapshot(gameDoc => modifyWithPersonal(uid, gameId, gameDoc).then(cb));

export const handleGameAction = (game, action, metadata) =>
  Firebase.functions().httpsCallable('handleGameAction')({
    game,
    action,
    metadata,
  });
