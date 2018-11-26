import { put, all, takeEvery, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import {
  UPDATED,
  SUBMITTED,
  DELETED,
  CHANGED_SELECTED,
} from 'store/actions/deck.actions';
import { LOGGED_IN } from 'store/actions/user.actions';
import {
  updateDeck,
  getDecksByUser,
  submitDeck as callSubmitDeck,
  deleteDeck as callDeleteDeck,
} from 'store/api/deck.api';
import { createAction } from 'utils/store';

function* fetchDecks({ user }) {
  try {
    yield put(createAction(UPDATED.PENDING));
    const decks = yield getDecksByUser(user.uid);
    yield put(createAction(UPDATED.SUCCESS, { decks }));
  } catch (error) {
    yield put(createAction(UPDATED.ERROR, { error: error.message }));
  }
}

function* submitDeck({ link }) {
  try {
    const deckObj = yield call(callSubmitDeck, link);
    yield put(createAction(SUBMITTED.SUCCESS, { deck: deckObj }));
    yield put(push(`/decks/${Object.keys(deckObj)[0]}`));
  } catch (error) {
    yield put(createAction(SUBMITTED.ERROR, { error: error.message }));
  }
}

function* deleteDeck({ id }) {
  try {
    yield call(callDeleteDeck, id);
    yield put(createAction(DELETED.SUCCESS, { id }));
    yield put(push('/decks'));
  } catch (error) {
    yield put(createAction(DELETED.ERROR, { error: error.message }));
  }
}

function* changeSelected({ previous, current }) {
  try {
    yield all([
      updateDeck(previous, { selected: false }),
      updateDeck(current, { selected: true }),
    ]);
    yield put(createAction(CHANGED_SELECTED.SUCCESS, { previous, current }));
  } catch (error) {
    yield put(createAction(CHANGED_SELECTED.ERROR, { error: error.message }));
  }
}

export default function*() {
  yield all([
    takeEvery(LOGGED_IN.SUCCESS, fetchDecks),
    takeEvery(SUBMITTED.PENDING, submitDeck),
    takeEvery(DELETED.PENDING, deleteDeck),
    takeEvery(CHANGED_SELECTED.PENDING, changeSelected),
  ]);
}
