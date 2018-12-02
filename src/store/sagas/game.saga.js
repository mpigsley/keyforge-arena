import { put, all, takeEvery, spawn, call, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import { LOGGED_IN, SIGNED_OUT } from 'store/actions/user.actions';
import { GAMES_UPDATED } from 'store/actions/game.actions';
import { gameListener } from 'store/api/game.api';

import { createAction } from 'utils/store';

const createGameListener = uid =>
  eventChannel(emit => {
    const unsubscribe = gameListener(uid, emit);
    return () => unsubscribe();
  });

function* gameHandler(channel) {
  while (true) {
    const { update, deleted } = yield take(channel);
    yield put(createAction(GAMES_UPDATED.SUCCESS, { update, deleted }));
  }
}

let gameChannel;
function* newGameFlow({ user }) {
  try {
    gameChannel = yield call(createGameListener, user.uid);
    yield spawn(gameHandler, gameChannel);
  } catch (error) {
    yield put(createAction(GAMES_UPDATED.ERROR, { error: error.message }));
  }
}

const closeGameChannel = () => {
  if (gameChannel) {
    gameChannel.close();
  }
};

export default function*() {
  yield all([
    takeEvery(LOGGED_IN.SUCCESS, newGameFlow),
    takeEvery(SIGNED_OUT.SUCCESS, closeGameChannel),
  ]);
}
