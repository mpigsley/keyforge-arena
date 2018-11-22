import Firebase from 'firebase/app';

export const getCurrentUser = () =>
  new Promise(resolve => {
    Firebase.auth().onAuthStateChanged(user => {
      if (!(user || {}).uid) {
        return resolve(null);
      }
      return Firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            resolve({ ...doc.data(), ...user.toJSON() });
          }
          resolve(user.toJSON());
        });
    });
  });

export const updateProfile = (uid, profile) => {
  if (!uid) {
    return new Error('Uid required to update a user.');
  }
  return Firebase.firestore()
    .collection('users')
    .doc(uid)
    .set(profile, { merge: true });
};

export const profileListener = (uid, cb) =>
  Firebase.firestore()
    .collection('users')
    .doc(uid)
    .onSnapshot(doc => cb(doc.data()));

export const doGoogleLogin = () =>
  Firebase.auth().signInWithPopup(new Firebase.auth.GoogleAuthProvider());

export const doSignup = (email, password) =>
  Firebase.auth().createUserWithEmailAndPassword(email, password);

export const doLogin = (email, password) =>
  Firebase.auth().signInWithEmailAndPassword(email, password);

export const doSignout = () => Firebase.auth().signOut();

export const doPasswordReset = email =>
  Firebase.auth().sendPasswordResetEmail(email);
