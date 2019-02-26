import {
  put,
  all,
  takeEvery,
  delay,
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
  getGameSequence,
  getIsDecksInitialized,
} from 'store/selectors/base.selectors';
import {
  gameDecks,
  gameState,
  playerHouse,
  opponentTurn,
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
  TURN_COMPLETE,
  HOUSE_CHANGED,
  GAME_INITIALIZED,
  CARD_MODAL_UPDATED,
  GAME_ACTION_HANDLED,
  updateSequence,
  handleGameAction,
} from 'store/actions/game.actions';
import {
  getGame,
  gameListener,
  handleGameAction as callHandleGameAction,
} from 'store/api/game.api';

import { createAction } from 'utils/store';
import GAME_SEQUENCE from 'constants/game-sequence.json';
import { size, map, some, find, values, every } from 'constants/lodash';
import CARD_MODAL_TYPE from 'constants/card-modal-types';
import GAME_ACTION_TYPES from 'constants/game-action-types.json';

function* checkExistingGames() {
  const selected = yield select(getSelectedGame);
  if (selected) {
    const userId = yield select(getUserId);
    const game = yield call(getGame, selected, userId);
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
  }
}

let gameChannel;
function* gameInitializationFlow({ gameId }) {
  try {
    const pathname = yield select(getPathname);
    if (!pathname.includes(gameId)) {
      yield put(push(`/game/${gameId}`));
    }

    const userId = yield select(getUserId);
    const update = yield call(getGame, gameId, userId);
    yield put(createAction(GAME_UPDATED.SUCCESS, update));
    gameChannel = yield call(createGameListener, gameId, userId);
    yield spawn(gameUpdateHandler, gameChannel);

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

const QUICK_SEQUENCE_TIMEOUT = 750;
function* gameSequence() {
  yield call(preGameSequence);

  let isFinished = yield select(isGameFinished);
  while (!isFinished) {
    while (yield select(opponentTurn)) {
      const currentGameSequence = yield select(getGameSequence);
      if (currentGameSequence !== GAME_SEQUENCE.OPPONENT.key) {
        yield put(updateSequence(GAME_SEQUENCE.OPPONENT.key));
      }
      yield take(GAME_UPDATED.SUCCESS);
    }

    if (!every(yield select(gameState).state, { turn: 1 })) {
      yield put(updateSequence(GAME_SEQUENCE.FORGE.key));
      yield delay(QUICK_SEQUENCE_TIMEOUT);
    }

    const currentHouse = yield select(playerHouse);
    if (!currentHouse) {
      yield put(updateSequence(GAME_SEQUENCE.HOUSE.key));
      const { house } = yield take(HOUSE_CHANGED);
      yield put(handleGameAction(GAME_ACTION_TYPES.CHOOSE_HOUSE, { house }));
    }

    yield put(updateSequence(GAME_SEQUENCE.MAIN.key));
    yield take(TURN_COMPLETE);

    yield put(updateSequence(GAME_SEQUENCE.READY.key));
    yield delay(QUICK_SEQUENCE_TIMEOUT);

    yield put(updateSequence(GAME_SEQUENCE.DRAW.key));
    yield delay(QUICK_SEQUENCE_TIMEOUT);

    isFinished = yield select(isGameFinished);
  }

  yield call(postGameSequence);
}

function* onHandleGameAction({ action, metadata }) {
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
    takeEvery(ACCEPT_CHALLENGE.SUCCESS, gameInitializationFlow),
    takeEvery(SIGNED_OUT.SUCCESS, closeGameChannel),
    takeEvery(GAME_INITIALIZED, gameSequence),
    takeEvery(GAME_ACTION_HANDLED.PENDING, onHandleGameAction),
  ]);
}
