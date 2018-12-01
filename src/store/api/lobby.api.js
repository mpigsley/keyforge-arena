import Firebase from 'firebase/app';

export const createChallengeLobby = (player, opponent) => {
  const doc = {
    created: Firebase.firestore.FieldValue.serverTimestamp(),
    players: [opponent, player],
    creator: player,
  };
  return Firebase.firestore()
    .collection('lobby')
    .add(doc)
    .then(ref => ref.id);
};

export const cancelLobby = lobby =>
  Firebase.firestore()
    .collection('lobby')
    .doc(lobby)
    .delete();

export const cancelLobbies = lobbies => {
  const batch = Firebase.firestore().batch();
  lobbies.forEach(lobby =>
    batch.delete(
      Firebase.firestore()
        .collection('lobby')
        .doc(lobby),
    ),
  );
  return batch.commit();
};

export const lobbyListener = (uid, cb) =>
  Firebase.firestore()
    .collection('lobby')
    .where('players', 'array-contains', uid)
    .onSnapshot(snapShot => {
      let lobbies = {};
      snapShot.forEach(doc => {
        lobbies = {
          ...lobbies,
          [doc.id]: doc.data(),
        };
      });
      cb(lobbies);
    });
