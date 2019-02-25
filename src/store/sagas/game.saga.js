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
  getDecks,
  getUserId,
  getPathname,
  getCardModal,
  getSelectedGame,
  getIsGameInitialized,
  getIsDecksInitialized,
} from 'store/selectors/base.selectors';
import {
  gameDecks,
  gameState,
  isGameFinished,
  hasLoadedGameDecks,
} from 'store/selectors/game.selectors';
import {
  UPDATED as UPDATED_DECKS,
  fetchDeck,
} from 'store/actions/deck.actions';
import { LOGGED_IN, SIGNED_OUT } from 'store/actions/user.actions';
import { ACCEPT_CHALLENGE } from 'store/actions/lobby.actions';
import {
  fetchCardImages,
  FETCHED_CARD_LINKS,
} from 'store/actions/image.actions';
import {
  GAME_UPDATED,
  GAME_INITIALIZED,
  CARD_MODAL_UPDATED,
  GAME_ACTION_HANDLED,
} from 'store/actions/game.actions';
import {
  getGame,
  gameListener,
  handleGameAction as callHandleGameAction,
} from 'store/api/game.api';

import { createAction } from 'utils/store';
import { size, map, some, find, values } from 'constants/lodash';
import CARD_MODAL_TYPE from 'constants/card-modal-types';

function* checkExistingGames() {
  const selected = yield select(getSelectedGame);
  if (selected) {
    const game = yield call(getGame, selected);
    if (game) {
      yield put(createAction(ACCEPT_CHALLENGE.SUCCESS, { gameId: selected }));
    } else {
      yield put(push('/dashboard'));
    }
  }
  // TODO: check for resent games, modal for re-join, finalized old games
}

const createGameListener = (gameId, userId) =>
  eventChannel(emit => {
    const unsubscribe = gameListener(gameId, userId, emit);
    return () => unsubscribe();
  });

function* gameUpdateHandler(channel) {
  while (true) {
    const update = yield take(channel);
    yield put(createAction(GAME_UPDATED.SUCCESS, update));

    const isInitialized = yield select(getIsGameInitialized);
    if (!isInitialized) {
      const pathname = yield select(getPathname);
      if (!pathname.includes(update.gameId)) {
        yield put(push(`/game/${update.gameId}`));
      }

      const isDecksInitialized = yield select(getIsDecksInitialized);
      if (!isDecksInitialized) {
        yield take(UPDATED_DECKS.SUCCESS);
      }

      const decks = yield select(getDecks);
      const unknownDecks = values(update.game.state)
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

      yield put(createAction(GAME_INITIALIZED));
    }
  }
}

let gameChannel;
function* gameUpdateFlow({ gameId }) {
  try {
    const userId = yield select(getUserId);
    gameChannel = yield call(createGameListener, gameId, userId);
    yield spawn(gameUpdateHandler, gameChannel);
  } catch (error) {
    yield put(createAction(GAME_UPDATED.ERROR, { error: error.message }));
  }
}

const closeGameChannel = () => {
  if (gameChannel) {
    gameChannel.close();
  }
};

function* preGameSequence() {
  let currentState = yield select(gameState);
  while (some(currentState.state, { turn: 0 })) {
    const playerState = find(currentState.state, { isOpponent: false });
    const currentKey = yield select(getCardModal);
    let modalKey;
    if (playerState.turn) {
      modalKey = CARD_MODAL_TYPE.STARTING_HAND.key;
    } else if (currentState.turn === playerState.key) {
      modalKey = CARD_MODAL_TYPE.STARTING_HAND_FIRST.key;
    } else {
      modalKey = CARD_MODAL_TYPE.STARTING_HAND_SECOND.key;
    }
    if (currentKey !== modalKey) {
      yield put(createAction(CARD_MODAL_UPDATED, { key: modalKey }));
    }
    yield take(GAME_UPDATED.SUCCESS);
    currentState = yield select(gameState);
  }

  if (yield select(getCardModal)) {
    yield put(createAction(CARD_MODAL_UPDATED, { key: null }));
  }
}

function postGameSequence() {}

function* gameSequence() {
  yield call(preGameSequence);

  let isFinished = yield select(isGameFinished);
  while (!isFinished) {
    // Loooooop
    isFinished = yield select(isGameFinished);
  }

  yield call(postGameSequence);
}

function* handleGameAction({ action, metadata }) {
  try {
    const selectedGame = yield select(getSelectedGame);
    yield call(callHandleGameAction, selectedGame, action, metadata);
    yield put(createAction(GAME_ACTION_HANDLED.SUCCESS));
  } catch (error) {
    yield put(
      createAction(GAME_ACTION_HANDLED.ERROR, { error: error.message }),
    );
  }
}

export default function*() {
  yield all([
    takeEvery(LOGGED_IN.SUCCESS, checkExistingGames),
    takeEvery(ACCEPT_CHALLENGE.SUCCESS, gameUpdateFlow),
    takeEvery(SIGNED_OUT.SUCCESS, closeGameChannel),
    takeEvery(GAME_INITIALIZED, gameSequence),
    takeEvery(GAME_ACTION_HANDLED.PENDING, handleGameAction),
  ]);
}
