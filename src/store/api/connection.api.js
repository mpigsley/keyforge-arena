import Firebase from 'firebase/app';

export const connectionPing = () =>
  Firebase.functions()
    .httpsCallable('connectionPing')()
    .then(response => response.data);

export const requestConnection = connection =>
  Firebase.functions().httpsCallable('requestConnection')({ connection });

export const connectionReply = (connection, accepted) =>
  Firebase.functions().httpsCallable('connectionReply')({
    connection,
    accepted,
  });
