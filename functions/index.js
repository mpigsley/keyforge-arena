const admin = require('firebase-admin');

admin.initializeApp();

const submitDeck = require('./src/submit-deck');
const instantiateUser = require('./src/instantiate-user');
const updateUser = require('./src/update-user');
const requestConnection = require('./src/request-connection');
const connectionReply = require('./src/connection-reply');
const connectionPing = require('./src/connection-ping');
const createGame = require('./src/create-game');
const handleGameAction = require('./src/handle-game-action');

exports.submitDeck = submitDeck;
exports.instantiateUser = instantiateUser;
exports.updateUser = updateUser;
exports.requestConnection = requestConnection;
exports.connectionReply = connectionReply;
exports.connectionPing = connectionPing;
exports.createGame = createGame;
exports.handleGameAction = handleGameAction;
