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
import {
  hasLoadedGameDecks,
  hasGameLoaded,
  gameDecks,
  gameState,
} from 'store/selectors/game.selectors';
import {
  UPDATED as UPDATED_DECKS,
  fetchDeck,
} from 'store/actions/deck.actions';
import { LOGGED_IN, SIGNED_OUT } from 'store/actions/user.actions';
import {
  fetchCardImages,
  FETCHED_CARD_LINKS,
} from 'store/actions/image.actions';
import {
  GAMES_UPDATED,
  GAME_INITIALIZED,
  CARD_MODAL_UPDATED,
} from 'store/actions/game.actions';
import { gameListener } from 'store/api/game.api';

import { createAction } from 'utils/store';
import { size, map, some, find, every } from 'constants/lodash';
import CARD_MODAL_TYPE from 'constants/card-modal-types';

const createGameListener = uid =>
  eventChannel(emit => {
    const unsubscribe = gameListener(uid, emit);
    return () => unsubscribe();
  });

function* gameUpdateHandler(channel) {
  while (true) {
    const { update, deleted, personal } = yield take(channel);
    yield put(
      createAction(GAMES_UPDATED.SUCCESS, { update, deleted, personal }),
    );

    const pathname = yield select(getPathname);
    const isInitialized = yield select(hasGameLoaded);
    if (some(deleted, key => pathname.includes(key))) {
      yield put(push('/dashboard'));
    } else if (size(update) && !isInitialized) {
      // Initializing new game
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

      let imageFetches = 0;
      while (imageFetches < size(selectedDecks)) {
        yield take(FETCHED_CARD_LINKS.SUCCESS);
        imageFetches += 1;
      }

      yield put(createAction(GAME_INITIALIZED, { key }));
    }
  }
}

let gameChannel;
function* gameUpdateFlow({ user }) {
  try {
    gameChannel = yield call(createGameListener, user.uid);
    yield spawn(gameUpdateHandler, gameChannel);
  } catch (error) {
    yield put(createAction(GAMES_UPDATED.ERROR, { error: error.message }));
  }
}

const closeGameChannel = () => {
  if (gameChannel) {
    gameChannel.close();
  }
};

function* gameSequence() {
  const state = yield select(gameState);
  const playerState = find(state.state, { isOpponent: false }) || {};
  // const opponentState = find(state.state, { isOpponent: true }) || {};
  if (every(state.state, { turn: 0 }) && state.turn) {
    yield put(
      createAction(CARD_MODAL_UPDATED, {
        key:
          state.turn === playerState.key
            ? CARD_MODAL_TYPE.STARTING_HAND_FIRST.key
            : CARD_MODAL_TYPE.STARTING_HAND_SECOND.key,
      }),
    );
  }
}

export default function*() {
  yield all([
    takeEvery(LOGGED_IN.SUCCESS, gameUpdateFlow),
    takeEvery(SIGNED_OUT.SUCCESS, closeGameChannel),
    takeEvery(GAME_INITIALIZED, gameSequence),
  ]);
}
