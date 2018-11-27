import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@connection';
export const UPDATE = createAsyncTypes(`${ACTION_PREFIX}/UPDATE`);
export const REQUEST = createAsyncTypes(`${ACTION_PREFIX}/REQUEST`);
export const REPLY = createAsyncTypes(`${ACTION_PREFIX}/REPLY`);

export const requestConnection = connection => ({
  type: REQUEST.PENDING,
  connection,
});
export const connectionReply = (connection, accepted) => ({
  type: REPLY.PENDING,
  connection,
  accepted,
});
