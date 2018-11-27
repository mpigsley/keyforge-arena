import { put, all, call, take, takeEvery, spawn } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import toastr from 'react-redux-toastr';

import {
  connectionPing as callConnectionPing,
  requestConnection as callRequestConnection,
  connectionReply as callConnectionReply,
} from 'store/api/connection.api';
import { REQUEST, REPLY, UPDATE } from 'store/actions/connection.actions';
import { LOGGED_IN, SIGNED_OUT } from 'store/actions/user.actions';

import { createAction } from 'utils/store';

const createConnectionPingInterval = () =>
  eventChannel(emit => {
    const id = setInterval(() => emit(true), 30000);
    return () => clearInterval(id);
  });

function* connectionPing() {
  const connections = yield call(callConnectionPing);
  yield put(createAction(UPDATE.SUCCESS, { connections }));
}

function* pingListener(channel) {
  while (yield take(channel)) {
    yield call(connectionPing);
  }
}

let pingChannel;
function* connectionPingFlow() {
  try {
    pingChannel = yield call(createConnectionPingInterval);
    yield spawn(pingListener, pingChannel);
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
    yield call(callRequestConnection, connection);
    yield put(createAction(REQUEST.SUCCESS));
    toastr.success(
      'Connection Request Sent',
      'If the user accepts they will show up on the dashboard.',
    );
  } catch (error) {
    yield put(createAction(REQUEST.ERROR, { error: error.message }));
  }
}

function* connectionReply({ connection, accepted }) {
  try {
    yield call(callConnectionReply, connection, accepted);
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
    takeEvery(REPLY.PENDING, connectionReply),
  ]);
}
