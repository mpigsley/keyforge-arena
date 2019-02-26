import {
  all,
  call,
  put,
  take,
  spawn,
  takeEvery,
  select,
} from 'redux-saga/effects';
import { toastr } from 'react-redux-toastr';
import { eventChannel } from 'redux-saga';
import { push } from 'connected-react-router';

import {
  cancelLobby,
  cancelLobbies,
  lobbyListener,
  createChallengeLobby,
} from 'store/api/lobby.api';
import { createGame } from 'store/api/game.api';
import {
  LOBBIES_UPDATED,
  CHALLENGE,
  CANCEL_CHALLENGE,
  ACCEPT_CHALLENGE,
} from 'store/actions/lobby.actions';
import { LOGGED_IN, SIGNED_OUT } from 'store/actions/user.actions';
import {
  getUserId,
  getLobbies,
  getCurrentLobby,
} from 'store/selectors/base.selectors';
import { activeDeckId } from 'store/selectors/deck.selectors';
import { createAction } from 'utils/store';
import { keys, find } from 'constants/lodash';

const createLobbyListener = uid =>
  eventChannel(emit => {
    const unsubscribe = lobbyListener(uid, emit);
    return () => unsubscribe();
  });

function* lobbyHandler(channel, uid) {
  while (true) {
    const { update, deleted } = yield take(channel);
    const currentLobby = yield select(getCurrentLobby);
    yield put(createAction(LOBBIES_UPDATED.SUCCESS, { update, deleted }));
    if (find(update, ({ creator, game }) => creator !== uid && !game)) {
      yield call(
        toastr.info,
        "You've Been Challenged!",
        'Accept it now on your dashboard.',
      );
    }
    const gameId = (update[currentLobby] || {}).game;
    if (gameId) {
      yield put(createAction(ACCEPT_CHALLENGE.SUCCESS, { gameId }));
      const lobbies = yield select(getLobbies);
      yield call(cancelLobbies, keys(lobbies));
    }
    // if (currentLobby && includes(deleted, currentLobby)) {
    //   yield call(
    //     toastr.warning,
    //     'Challenge Cancelled',
    //     'You or your opponent has cancelled the challenge.',
    //   );
    // }
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
    const deck = yield select(activeDeckId);
    const lobby = yield call(createChallengeLobby, player, opponent, deck);
    yield put(createAction(CHALLENGE.SUCCESS, { lobby }));
    yield put(push('/lobby'));
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

function* createGameFlow({ challenge }) {
  try {
    const deck = yield select(activeDeckId);
    const gameId = yield call(createGame, challenge, deck);
    yield put(createAction(ACCEPT_CHALLENGE.SUCCESS, { gameId }));
  } catch (error) {
    yield put(createAction(ACCEPT_CHALLENGE.ERROR, { error: error.message }));
  }
}

export default function*() {
  yield all([
    takeEvery(LOGGED_IN.SUCCESS, connectionLobbyFlow),
    takeEvery(SIGNED_OUT.SUCCESS, closeLobbyChannel),
    takeEvery(CHALLENGE.PENDING, challengeFlow),
    takeEvery(CANCEL_CHALLENGE.PENDING, cancelChallengeFlow),
    takeEvery(ACCEPT_CHALLENGE.PENDING, createGameFlow),
  ]);
}
