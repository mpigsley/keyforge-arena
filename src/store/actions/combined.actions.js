import { getCurrentUser } from 'store/api/session.api';
import { getDecks } from 'store/api/deck.api';
import { getHouseLink } from 'store/api/image.api';

import Houses from 'constants/houses';
import { zipObject } from 'constants/lodash';

const ACTION_PREFIX = '@@combined';
export const INITIALIZED = `${ACTION_PREFIX}/INITIALIZED`;
export const FETCHED_IMAGE_LINKS = `${ACTION_PREFIX}/FETCHED_IMAGE_LINKS`;

export const initialize = user => async dispatch => {
  const currentUser = user || (await getCurrentUser());
  let decks;
  if (currentUser) {
    decks = await getDecks(currentUser.uid);
  }
  dispatch({ type: INITIALIZED, user: currentUser, decks });

  const houseList = Object.keys(Houses);
  const links = await Promise.all(houseList.map(getHouseLink));
  dispatch({ type: FETCHED_IMAGE_LINKS, houses: zipObject(houseList, links) });
};
