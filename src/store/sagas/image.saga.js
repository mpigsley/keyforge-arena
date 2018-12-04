import { put, all, call, takeEvery, select } from 'redux-saga/effects';

import {
  FETCHED_HOUSE_LINKS,
  FETCHED_CARD_LINKS,
} from 'store/actions/image.actions';
import { makeGetUnfetchedImageLinks } from 'store/selectors/image.selectors';
import { getHouseLink, getCardLink } from 'store/api/image.api';

import { zipObject } from 'constants/lodash';
import { getUniqueCards } from 'utils/deck';
import { createAction } from 'utils/store';
import Houses from 'constants/houses';

const imageObject = link =>
  new Promise(resolve => {
    const obj = new Image();
    obj.onload = resolve;
    obj.src = link;
  });

function* createObjects(links) {
  const objects = yield all(links.map(imageObject));
  return links.map((link, i) => ({ link, object: objects[i] }));
}

function* fetchHouses() {
  try {
    yield put(createAction(FETCHED_HOUSE_LINKS.PENDING));
    const houseList = Object.keys(Houses);
    const links = yield all(houseList.map(getHouseLink));
    const houses = yield call(createObjects, links);
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

function* fetchCards({ expansion, deck }) {
  try {
    const cards = getUniqueCards(deck);
    const getUnfetchedLinks = makeGetUnfetchedImageLinks(expansion, cards);
    const unfetchedLinks = yield select(getUnfetchedLinks);
    if (!unfetchedLinks.length) {
      return;
    }
    const links = yield all(
      unfetchedLinks.map(key => getCardLink(...key.split('-'))),
    );
    const images = yield call(createObjects, links);
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
