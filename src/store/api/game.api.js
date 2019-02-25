import Firebase from 'firebase/app';

export const createGame = (lobby, deck) =>
  Firebase.functions()
    .httpsCallable('createGame')({ lobby, deck })
    .then(response => response.data);

export const getGame = id =>
  Firebase.firestore()
    .collection('games')
    .doc(id)
    .get()
    .then(doc => {
      if (doc.exists) {
        return doc.data();
      }
      return undefined;
    });

export const getPersonalGameState = (uid, gameId) =>
  Firebase.firestore()
    .collection('games')
    .doc(gameId)
    .collection('personal')
    .doc(uid)
    .get();

export const gameListener = (gameId, uid, cb) =>
  Firebase.firestore()
    .collection('games')
    .doc(gameId)
    .onSnapshot(gameDoc =>
      getPersonalGameState(uid, gameId).then(personalDoc => {
        const game = gameDoc.data();
        cb({
          gameId,
          game: {
            ...game,
            state: {
              ...game.state,
              [uid]: { ...game.state[uid], ...personalDoc.data() },
            },
          },
        });
      }),
    );

export const handleGameAction = (game, action, metadata) =>
  Firebase.functions().httpsCallable('handleGameAction')({
    game,
    action,
    metadata,
  });
