import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@game';
export const CHALLENGE = createAsyncTypes(`${ACTION_PREFIX}/CHALLENGE`);
export const LOBBIES_UPDATED = createAsyncTypes(
  `${ACTION_PREFIX}/LOBBIES_UPDATED`,
);

export const challengeConnection = opponent => ({
  type: CHALLENGE.PENDING,
  opponent,
});
