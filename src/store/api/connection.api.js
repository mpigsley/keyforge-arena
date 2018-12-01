import Firebase from 'firebase/app';

export const pingConnection = () =>
  Firebase.functions()
    .httpsCallable('connectionPing')()
    .then(response => response.data);

export const connectionRequest = connection =>
  Firebase.functions().httpsCallable('requestConnection')({
    connection,
  });

export const connectionReply = (connection, accepted) =>
  Firebase.functions().httpsCallable('connectionReply')({
    connection,
    accepted,
  });
