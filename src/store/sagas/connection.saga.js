import {
  put,
  all,
  call,
  take,
  takeEvery,
  spawn,
  select,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { toastr } from 'react-redux-toastr';

import {
  pingConnection,
  connectionRequest,
  connectionReply,
} from 'store/api/connection.api';
import { REQUEST, REPLY, UPDATE } from 'store/actions/connection.actions';
import { LOGGED_IN, SIGNED_OUT } from 'store/actions/user.actions';
import { getConnections } from 'store/selectors/base.selectors';

import { createAction } from 'utils/store';
import { isEqual } from 'constants/lodash';

const createConnectionPingInterval = () =>
  eventChannel(emit => {
    const id = setInterval(() => emit(true), 30000);
    return () => clearInterval(id);
  });

function* connectionPing() {
  const connections = yield call(pingConnection);
  const currentConnections = yield select(getConnections);
  if (!isEqual(currentConnections, connections)) {
    yield put(createAction(UPDATE.SUCCESS, { connections }));
  }
}

function* pingHandler(channel) {
  while (yield take(channel)) {
    yield call(connectionPing);
  }
}

let pingChannel;
function* connectionPingFlow() {
  try {
    pingChannel = yield call(createConnectionPingInterval);
    yield spawn(pingHandler, pingChannel);
    yield call(connectionPing);
  } catch (error) {
    yield put(createAction(UPDATE.ERROR, { error: error.message }));
  }
}

const closePingChannel = () => {
  if (pingChannel) {
    pingChannel.close();
  }
};

function* requestConnection({ connection }) {
  try {
    yield call(connectionRequest, connection);
    yield put(createAction(REQUEST.SUCCESS));
    yield call(
      toastr.success,
      'Connection Request Sent',
      'If the user accepts they will show up on the dashboard.',
    );
  } catch (error) {
    yield put(createAction(REQUEST.ERROR, { error: error.message }));
  }
}

function* replyToConnection({ connection, accepted }) {
  try {
    yield call(connectionReply, connection, accepted);
    yield put(createAction(REPLY.SUCCESS, { connection, accepted }));
  } catch (error) {
    yield put(createAction(REPLY.ERROR, { error: error.message }));
  }
}

export default function*() {
  yield all([
    takeEvery(LOGGED_IN.SUCCESS, connectionPingFlow),
    takeEvery(SIGNED_OUT.SUCCESS, closePingChannel),
    takeEvery(REQUEST.PENDING, requestConnection),
    takeEvery(REPLY.PENDING, replyToConnection),
  ]);
}
