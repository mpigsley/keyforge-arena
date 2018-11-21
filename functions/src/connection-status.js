const functions = require('firebase-functions');

exports.connectionStatus = functions.pubsub
  .topic('connection-status')
  .onPublish(() => {
    console.log('This job is run every minute!');
    return true;
  });
