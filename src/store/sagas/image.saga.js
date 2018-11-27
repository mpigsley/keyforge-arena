import { put, all, call, takeEvery, select } from 'redux-saga/effects';

import {
  FETCHED_HOUSE_LINKS,
  FETCHED_CARD_LINKS,
} from 'store/actions/image.actions';
import { makeGetUnfetchedImageLinks } from 'store/selectors/image.selectors';
import { getHouseLink, getCardLink } from 'store/api/image.api';

import { zipObject } from 'constants/lodash';
import { createAction } from 'utils/store';
import Houses from 'constants/houses';

function* fetchHouses() {
  try {
    yield put(createAction(FETCHED_HOUSE_LINKS.PENDING));
    const houseList = Object.keys(Houses);
    const houses = yield all(houseList.map(getHouseLink));
    yield put(
      createAction(FETCHED_HOUSE_LINKS.SUCCESS, {
        houses: zipObject(houseList, houses),
      }),
    );
  } catch (error) {
    yield put(
      createAction(FETCHED_HOUSE_LINKS.ERROR, { error: error.message }),
    );
  }
}

function* fetchCards({ expansion, cards }) {
  try {
    const getUnfetchedLinks = makeGetUnfetchedImageLinks(expansion, cards);
    const unfetchedLinks = yield select(getUnfetchedLinks);
    if (!unfetchedLinks.length) {
      return;
    }
    const images = yield all(
      unfetchedLinks.map(key => getCardLink(...key.split('-'))),
    );
    yield put(
      createAction(FETCHED_CARD_LINKS.SUCCESS, {
        cards: zipObject(unfetchedLinks, images),
      }),
    );
  } catch (error) {
    yield put(createAction(FETCHED_CARD_LINKS.ERROR, { error: error.message }));
  }
}

export default function*() {
  yield all([
    call(fetchHouses),
    takeEvery(FETCHED_CARD_LINKS.PENDING, fetchCards),
  ]);
}
