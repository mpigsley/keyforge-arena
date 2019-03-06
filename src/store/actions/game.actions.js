import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@game';
export const GAME_UPDATED = createAsyncTypes(`${ACTION_PREFIX}/GAME_UPDATED`);
export const GAME_INITIALIZED = `${ACTION_PREFIX}/GAME_INITIALIZED`;
export const CARD_MODAL_UPDATED = `${ACTION_PREFIX}/CARD_MODAL_UPDATED`;
export const ENDED_TURN = `${ACTION_PREFIX}/ENDED_TURN`;
export const HOUSE_CHANGED = `${ACTION_PREFIX}/HOUSE_CHANGED`;
export const SEQUENCE_UPDATED = `${ACTION_PREFIX}/SEQUENCE_UPDATED`;
export const DRAG = createAsyncTypes(`${ACTION_PREFIX}/DRAG`);
export const USED_CARD = `${ACTION_PREFIX}/USED_CARD`;
export const GAME_ACTION_HANDLED = createAsyncTypes(
  `${ACTION_PREFIX}/GAME_ACTION_HANDLED`,
);

export const startDrag = () => ({ type: DRAG.PENDING });
export const endDrag = () => ({ type: DRAG.SUCCESS });
export const setUsedCard = key => ({ type: USED_CARD, key });
export const endTurn = () => ({ type: ENDED_TURN });
export const chooseHouse = house => ({ type: HOUSE_CHANGED, house });
export const updateCardModal = key => ({ type: CARD_MODAL_UPDATED, key });
export const updateSequence = sequence => ({
  type: SEQUENCE_UPDATED,
  sequence,
});
export const handleGameAction = (action, metadata) => ({
  type: GAME_ACTION_HANDLED.PENDING,
  action,
  metadata,
});
