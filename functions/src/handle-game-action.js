const functions = require('firebase-functions');

const { getGameState, saveGameState } = require('../utils/game-sync');
const GAME_ACTION_TYPES = require('../constants/game-action-types.json');
const actionConfig = require('../utils/action-config');

module.exports = functions.https.onCall(
  async ({ game, action, metadata }, context) => {
    console.log(game, action, metadata);
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.',
      );
    } else if (!game) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'A reference to the current game is required.',
      );
    } else if (!action || !GAME_ACTION_TYPES[action] || !actionConfig[action]) {
      throw new functions.https.HttpsError(
        'unimplemented',
        'A valid action type is required.',
      );
    }

    try {
      const gameState = await getGameState(game, context.auth.uid, metadata);
      const { validate, invokeAction } = actionConfig[action];
      if (!validate(gameState)) {
        throw new functions.https.HttpsError(
          'aborted',
          'Action can not be performed based on the current game state.',
        );
      }
      const newGameState = invokeAction(gameState);
      await saveGameState(game, newGameState);
    } catch (e) {
      console.error(e);
      if (e.code === 'aborted') {
        throw e;
      }
      throw new functions.https.HttpsError(
        'unknown',
        'Could not perform game action.',
      );
    }
  },
);
