import { put, all, takeEvery, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { UPDATED_DECKS, SUBMITTED_DECK } from 'store/actions/deck.actions';
import { LOGGED_IN } from 'store/actions/user.actions';
import {
  getDecksByUser,
  submitDeck as callSubmitDeck,
} from 'store/api/deck.api';
import { createAction } from 'utils/store';

function* fetchDecks({ user }) {
  try {
    yield put(createAction(UPDATED_DECKS.PENDING));
    const decks = yield getDecksByUser(user.uid);
    yield put(createAction(UPDATED_DECKS.SUCCESS, { decks }));
  } catch (error) {
    yield put(createAction(UPDATED_DECKS.ERROR, { error: error.message }));
  }
}

function* submitDeck({ link }) {
  try {
    const deckObj = yield call(callSubmitDeck, link);
    yield put(createAction(SUBMITTED_DECK.SUCCESS, { deck: deckObj }));
    yield put(push(`/decks/${Object.keys(deckObj)[0]}`));
  } catch (error) {
    yield put(createAction(SUBMITTED_DECK.ERROR, { error: error.message }));
  }
}

export default function*() {
  yield all([
    takeEvery(LOGGED_IN.SUCCESS, fetchDecks),
    takeEvery(SUBMITTED_DECK.PENDING, submitDeck),
  ]);
}
