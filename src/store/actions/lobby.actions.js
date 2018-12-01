import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@lobby';
export const ACCEPT_CHALLENGE = `${ACTION_PREFIX}/ACCEPT_CHALLENGE`;
export const DENY_CHALLENGE = `${ACTION_PREFIX}/DENY_CHALLENGE`;
export const CHALLENGE = createAsyncTypes(`${ACTION_PREFIX}/CHALLENGE`);
export const LOBBIES_UPDATED = createAsyncTypes(
  `${ACTION_PREFIX}/LOBBIES_UPDATED`,
);

export const challengeConnection = opponent => ({
  type: CHALLENGE.PENDING,
  opponent,
});
