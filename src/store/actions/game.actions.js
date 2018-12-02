import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@game';
// eslint-disable-next-line
export const GAMES_UPDATED = createAsyncTypes(`${ACTION_PREFIX}/GAMES_UPDATED`);
