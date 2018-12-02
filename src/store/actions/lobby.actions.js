import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@lobby';
export const ACCEPT_CHALLENGE = createAsyncTypes(
  `${ACTION_PREFIX}/ACCEPT_CHALLENGE`,
);
export const CANCEL_CHALLENGE = createAsyncTypes(
  `${ACTION_PREFIX}/CANCEL_CHALLENGE`,
);
export const CHALLENGE = createAsyncTypes(`${ACTION_PREFIX}/CHALLENGE`);
export const LOBBIES_UPDATED = createAsyncTypes(
  `${ACTION_PREFIX}/LOBBIES_UPDATED`,
);

export const acceptChallenge = challenge => ({
  type: ACCEPT_CHALLENGE.PENDING,
  challenge,
});
export const cancelChallenge = challenge => ({
  type: CANCEL_CHALLENGE.PENDING,
  challenge,
});
export const challengeConnection = opponent => ({
  type: CHALLENGE.PENDING,
  opponent,
});
