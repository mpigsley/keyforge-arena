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
import dayjs from 'dayjs';

import {
  lobbyListener,
  deleteLobbies,
  createChallengeLobby,
} from 'store/api/lobby.api';
import { LOBBIES_UPDATED, CHALLENGE } from 'store/actions/lobby.actions';
import { LOGGED_IN, SIGNED_OUT } from 'store/actions/user.actions';
import { getUserId } from 'store/selectors/base.selectors';
import { createAction } from 'utils/store';
import { pick, without } from 'constants/lodash';

const createLobbyListener = uid =>
  eventChannel(emit => {
    const unsubscribe = lobbyListener(uid, emit);
    return () => unsubscribe();
  });

function* lobbyHandler(channel, uid) {
  while (true) {
    const update = yield take(channel);
    const recent = pick(
      update,
      ({ created, creator }) =>
        dayjs(created.toDate()).isAfter(dayjs().subtract(2, 'minute')) &&
        creator !== uid,
    );
    const recentKeys = Object.keys(recent);
    const deletableKeys = without(Object.keys(update), recentKeys);
    yield put(createAction(LOBBIES_UPDATED.SUCCESS, { update: recent }));
    if (recentKeys.length) {
      yield call(
        toastr.info,
        "You've been challenged!",
        'Accept it now on your dashboard.',
      );
    }
    if (deletableKeys.length) {
      deleteLobbies(deletableKeys);
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
    const [id, lobby] = yield call(createChallengeLobby, player, opponent);
    yield put(createAction(CHALLENGE.SUCCESS, { update: { [id]: lobby } }));
    yield put(push(`/lobby/${id}`));
  } catch (error) {
    yield put(createAction(CHALLENGE.ERROR, { error: error.message }));
  }
}

export default function*() {
  yield all([
    takeEvery(LOGGED_IN.SUCCESS, connectionLobbyFlow),
    takeEvery(SIGNED_OUT.SUCCESS, closeLobbyChannel),
    takeEvery(CHALLENGE.PENDING, challengeFlow),
  ]);
}
