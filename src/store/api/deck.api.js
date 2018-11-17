import Firebase from 'firebase/app';

export const getDecks = uid =>
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

export const submitDeck = link =>
  Firebase.functions()
    .httpsCallable('submitDeck')({ link })
    .then(response => response.data);
