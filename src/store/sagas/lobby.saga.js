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

import { lobbyListener, createChallengeLobby } from 'store/api/lobby.api';
import { LOBBIES_UPDATED, CHALLENGE } from 'store/actions/lobby.actions';
import { LOGGED_IN, SIGNED_OUT } from 'store/actions/user.actions';
import { getUserId } from 'store/selectors/base.selectors';
import { createAction } from 'utils/store';
import { find } from 'constants/lodash';

const createLobbyListener = uid =>
  eventChannel(emit => {
    const unsubscribe = lobbyListener(uid, emit);
    return () => unsubscribe();
  });

function* lobbyHandler(channel) {
  while (true) {
    const update = yield take(channel);
    yield put(createAction(LOBBIES_UPDATED.SUCCESS, { update }));
    const recent = find(update, ({ created }) =>
      dayjs(created.toDate()).isAfter(dayjs().subtract(30, 'second')),
    );
    if (recent) {
      yield call(
        toastr.info,
        'You have been challenged',
        'Would you like to accept?',
      );
    }
  }
}

let lobbyChannel;
function* connectionLobbyFlow({ user }) {
  try {
    lobbyChannel = yield call(createLobbyListener, user.uid);
    yield spawn(lobbyHandler, lobbyChannel);
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
