import { put, all, call, takeEvery } from 'redux-saga/effects';
import toastr from 'react-redux-toastr';

import {
  connectionPing as callConnectionPing,
  requestConnection as callRequestConnection,
  connectionReply as callConnectionReply,
} from 'store/api/connection.api';
import { REQUEST, REPLY, UPDATE } from 'store/actions/connection.actions';
import { LOGGED_IN } from 'store/actions/user.actions';

import { createAction } from 'utils/store';

function* connectionPing() {
  try {
    const connections = yield call(callConnectionPing);
    yield put(createAction(UPDATE.SUCCESS, { connections }));
  } catch (error) {
    yield put(createAction(UPDATE.ERROR, { error: error.message }));
  }
}

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
    yield put(createAction(REPLY.SUCCESS));
  } catch (error) {
    yield put(createAction(REPLY.ERROR, { error: error.message }));
  }
}

export default function*() {
  yield all([
    takeEvery(LOGGED_IN.SUCCESS, connectionPing),
    takeEvery(REQUEST.PENDING, requestConnection),
    takeEvery(REPLY.PENDING, connectionReply),
  ]);
}
