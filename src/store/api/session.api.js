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

export const googleLogin = () =>
  Firebase.auth().signInWithPopup(new Firebase.auth.GoogleAuthProvider());

export const signup = ({ email, password, confirm }) => {
  if (!email || !password || !confirm) {
    throw new Error('Email and password are required.');
  }
  if (password !== confirm) {
    throw new Error('Passwords do not match.');
  }
  return Firebase.auth().createUserWithEmailAndPassword(email, password);
};

export const login = ({ email, password }) =>
  Firebase.auth().signInWithEmailAndPassword(email, password);

export const signout = () => Firebase.auth().signOut();

export const passwordReset = email =>
  Firebase.auth().sendPasswordResetEmail(email);
