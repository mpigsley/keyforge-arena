import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@game';
export const GAME_UPDATED = createAsyncTypes(`${ACTION_PREFIX}/GAME_UPDATED`);
export const GAME_INITIALIZED = `${ACTION_PREFIX}/GAME_INITIALIZED`;
export const CARD_MODAL_UPDATED = `${ACTION_PREFIX}/CARD_MODAL_UPDATED`;
export const TURN_COMPLETE = `${ACTION_PREFIX}/TURN_COMPLETE`;
export const SEQUENCE_UPDATED = `${ACTION_PREFIX}/SEQUENCE_UPDATED`;
export const GAME_ACTION_HANDLED = createAsyncTypes(
  `${ACTION_PREFIX}/GAME_ACTION_HANDLED`,
);

export const updateCardModal = key => ({ type: CARD_MODAL_UPDATED, key });
export const handleGameAction = (action, metadata) => ({
  type: GAME_ACTION_HANDLED.PENDING,
  action,
  metadata,
});
