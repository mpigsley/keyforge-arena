import {
  all,
  call,
  put,
  take,
  spawn,
  takeEvery,
  select,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { toastr } from 'react-redux-toastr';
import { eventChannel } from 'redux-saga';

import {
  lobbyListener,
  createChallengeLobby,
  cancelLobby,
} from 'store/api/lobby.api';
import {
  LOBBIES_UPDATED,
  CHALLENGE,
  CANCEL_CHALLENGE,
} from 'store/actions/lobby.actions';
import { LOGGED_IN, SIGNED_OUT } from 'store/actions/user.actions';
import { getUserId, getPathname } from 'store/selectors/base.selectors';
import { createAction } from 'utils/store';
import { some, includes, find } from 'constants/lodash';

const createLobbyListener = uid =>
  eventChannel(emit => {
    const unsubscribe = lobbyListener(uid, emit);
    return () => unsubscribe();
  });

function* lobbyHandler(channel, uid) {
  while (true) {
    const { update, deleted } = yield take(channel);
    yield put(createAction(LOBBIES_UPDATED.SUCCESS, { update, deleted }));
    if (find(update, ({ creator }) => creator !== uid)) {
      yield call(
        toastr.info,
        "You've Been Challenged!",
        'Accept it now on your dashboard.',
      );
    }
    const path = yield select(getPathname);
    if (some(deleted, id => includes(path, id))) {
      yield put(push('/dashboard'));
      yield call(
        toastr.info,
        'Challenge Cancelled',
        'Your opponent has decided not to accept.',
      );
    }
  }
}

let lobbyChannel;
function* connectionLobbyFlow({ user }) {
  try {
    lobbyChannel = yield call(createLobbyListener, user.uid);
    yield spawn(lobbyHandler, lobbyChannel, user.uid);
  } catch (error) {
    yield put(createAction(LOBBIES_UPDATED.ERROR, { error: error.message }));
  }
}

const closeLobbyChannel = () => {
  if (lobbyChannel) {
    lobbyChannel.close();
  }
};

function* challengeFlow({ opponent }) {
  const player = yield select(getUserId);
  if (!player || !opponent) {
    return;
  }
  try {
    const id = yield call(createChallengeLobby, player, opponent);
    yield put(createAction(CHALLENGE.SUCCESS));
    yield put(push(`/lobby/${id}`));
  } catch (error) {
    yield put(createAction(CHALLENGE.ERROR, { error: error.message }));
  }
}

function* cancelChallengeFlow({ challenge }) {
  try {
    yield call(cancelLobby, challenge);
    yield put(createAction(CANCEL_CHALLENGE.SUCCESS));
  } catch (error) {
    yield put(createAction(CANCEL_CHALLENGE.ERROR, { error: error.message }));
  }
}

export default function*() {
  yield all([
    takeEvery(LOGGED_IN.SUCCESS, connectionLobbyFlow),
    takeEvery(SIGNED_OUT.SUCCESS, closeLobbyChannel),
    takeEvery(CHALLENGE.PENDING, challengeFlow),
    takeEvery(CANCEL_CHALLENGE.PENDING, cancelChallengeFlow),
  ]);
}
