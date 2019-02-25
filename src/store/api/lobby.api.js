import Firebase from 'firebase/app';

export const createChallengeLobby = (player, opponent, deck) =>
  Firebase.firestore()
    .collection('lobby')
    .add({
      created: Firebase.firestore.FieldValue.serverTimestamp(),
      players: [opponent, player],
      creator: player,
      deck,
    })
    .then(ref => ref.id);

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
