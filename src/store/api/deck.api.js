import Firebase from 'firebase/app';

export const getDecksByUser = uid =>
  Firebase.firestore()
    .collection('decks')
    .where('creator', '==', uid)
    .get()
    .then(typeSnapshot => {
      let decks = {};
      typeSnapshot.forEach(doc => {
        decks = {
          ...decks,
          [doc.id]: doc.data(),
        };
      });
      return decks;
    });

export const getDeck = id =>
  Firebase.firestore()
    .collection('decks')
    .doc(id)
    .get()
    .then(deck => {
      if (deck.exists) {
        return [deck.id, deck.data()];
      }
      return [];
    });

export const getDecks = deckIds =>
  Promise.all(deckIds.map(getDeck)).then(decks =>
    decks.reduce((obj, [id, deck]) => ({ ...obj, [id]: deck }), {}),
  );

export const submitDeck = link =>
  Firebase.functions()
    .httpsCallable('submitDeck')({ link })
    .then(response => response.data);

export const deleteDeck = id =>
  Firebase.firestore()
    .collection('decks')
    .doc(id)
    .delete();

export const updateDeck = (id, update) =>
  Firebase.firestore()
    .collection('decks')
    .doc(id)
    .set(update, { merge: true });
