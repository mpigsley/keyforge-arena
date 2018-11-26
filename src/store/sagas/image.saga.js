import { put, all, call } from 'redux-saga/effects';

import { FETCHED_HOUSE_LINKS } from 'store/actions/image.actions';
import { getHouseLink } from 'store/api/image.api';

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

export default function*() {
  yield all([call(fetchHouses)]);
}
