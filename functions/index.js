const admin = require('firebase-admin');

const submitDeck = require('./src/submit-deck');
const connectionStatus = require('./src/connection-status');

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.submitDeck = submitDeck;
exports.connectionStatus = connectionStatus;
