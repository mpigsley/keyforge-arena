const admin = require('firebase-admin');

const submitDeck = require('./src/submit-deck');
const instantiateUser = require('./src/instantiate-user');
const updateUser = require('./src/update-user');
const requestConnection = require('./src/request-connection');
const connectionReply = require('./src/connection-reply');

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.submitDeck = submitDeck;
exports.instantiateUser = instantiateUser;
exports.updateUser = updateUser;
exports.requestConnection = requestConnection;
exports.connectionReply = connectionReply;
