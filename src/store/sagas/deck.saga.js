import { put, all, call, takeEvery } from 'redux-saga/effects';

import { LOGGED_IN } from 'store/actions/session.actions';
import { UPDATED_DECKS } from 'store/actions/deck.actions';
import { getDecksByUser } from 'store/api/deck.api';
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

function* initializeDecks() {
  yield takeEvery(LOGGED_IN.SUCCESS, fetchDecks);
}

export default function*() {
  yield all([call(initializeDecks)]);
}
