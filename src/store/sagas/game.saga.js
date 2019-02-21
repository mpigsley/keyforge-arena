import {
  put,
  all,
  takeEvery,
  spawn,
  call,
  take,
  select,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { eventChannel } from 'redux-saga';

import {
  getIsDecksInitialized,
  getPathname,
  getDecks,
} from 'store/selectors/base.selectors';
import { hasLoadedGameDecks, gameDecks } from 'store/selectors/game.selectors';
import {
  UPDATED as UPDATED_DECKS,
  fetchDeck,
} from 'store/actions/deck.actions';
import { LOGGED_IN, SIGNED_OUT } from 'store/actions/user.actions';
import { fetchCardImages } from 'store/actions/image.actions';
import { GAMES_UPDATED } from 'store/actions/game.actions';
import { gameListener } from 'store/api/game.api';

import { createAction } from 'utils/store';
import { size, map, some, mapValues } from 'constants/lodash';

const createGameListener = uid =>
  eventChannel(emit => {
    const unsubscribe = gameListener(uid, emit);
    return () => unsubscribe();
  });

function* gameHandler(channel) {
  while (true) {
    const { update, deleted, personal } = yield take(channel);
    const gameUpdate = mapValues(update, game => ({
      ...game,
      state: mapValues(game.state, (state, uid) => ({
        ...state,
        ...(personal[uid] || {}),
      })),
    }));
    yield put(
      createAction(GAMES_UPDATED.SUCCESS, { update: gameUpdate, deleted }),
    );
    const pathname = yield select(getPathname);
    if (some(deleted, key => pathname.includes(key))) {
      yield put(push('/dashboard'));
    } else if (size(update)) {
      const key = Object.keys(update)[0];
      if (!pathname.includes(key)) {
        yield put(push(`/game/${key}`));
      }

      const isDecksInitialized = yield select(getIsDecksInitialized);
      if (!isDecksInitialized) {
        yield take(UPDATED_DECKS.SUCCESS);
      }

      const decks = yield select(getDecks);
      const unknownDecks = Object.values(update[key].state)
        .map(state => state.deck)
        .filter(deck => !decks[deck]);
      if (unknownDecks.length) {
        yield all(unknownDecks.map(id => put(fetchDeck(id))));
      }

      let hasAllDecks = false;
      while (!hasAllDecks) {
        yield take(UPDATED_DECKS.SUCCESS);
        hasAllDecks = yield select(hasLoadedGameDecks);
      }

      const selectedDecks = yield select(gameDecks);
      yield all(
        map(selectedDecks, ({ expansion, ...selected }) =>
          put(fetchCardImages(expansion, selected)),
        ),
      );
    }
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
