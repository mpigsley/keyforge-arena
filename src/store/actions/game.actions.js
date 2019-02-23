import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@game';
export const GAMES_UPDATED = createAsyncTypes(`${ACTION_PREFIX}/GAMES_UPDATED`);
export const GAME_INITIALIZED = `${ACTION_PREFIX}/GAME_INITIALIZED`;
export const CARD_MODAL_UPDATED = `${ACTION_PREFIX}/CARD_MODAL_UPDATED`;

export const updateCardModal = key => ({ type: CARD_MODAL_UPDATED, key });
