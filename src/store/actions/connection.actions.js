import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@connection';
export const UPDATE = createAsyncTypes(`${ACTION_PREFIX}/UPDATE`);
export const REQUEST = createAsyncTypes(`${ACTION_PREFIX}/REQUEST`);
export const REPLY = createAsyncTypes(`${ACTION_PREFIX}/REPLY`);
export const UNSET_ERROR = `${ACTION_PREFIX}/UNSET_ERROR`;
export const TOGGLED_CONNECT_MODAL = `${ACTION_PREFIX}/TOGGLED_CONNECT_MODAL`;

export const unsetError = () => ({ type: UNSET_ERROR });
export const toggleConnectModal = () => ({ type: TOGGLED_CONNECT_MODAL });
export const requestConnection = connection => ({
  type: REQUEST.PENDING,
  connection,
});
export const connectionReply = (connection, accepted) => ({
  type: REPLY.PENDING,
  connection,
  accepted,
});
