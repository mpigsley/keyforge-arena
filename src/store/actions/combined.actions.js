import { getCurrentUser } from 'store/api/session.api';
import { getDecks } from 'store/api/deck.api';
import { getHouseLink } from 'store/api/image.api';

import Houses from 'constants/houses';
import { zipObject } from 'constants/lodash';

const ACTION_PREFIX = '@@combined';
export const INITIALIZED = `${ACTION_PREFIX}/INITIALIZED`;
export const FETCHED_IMAGE_LINKS = `${ACTION_PREFIX}/FETCHED_IMAGE_LINKS`;

export const initialize = () => async dispatch => {
  const user = await getCurrentUser();
  let decks;
  if (user) {
    decks = await getDecks(user.uid);
  }
  dispatch({ type: INITIALIZED, user, decks });

  const houseList = Object.values(Houses);
  const links = await Promise.all(houseList.map(getHouseLink));
  dispatch({ type: FETCHED_IMAGE_LINKS, houses: zipObject(houseList, links) });
};
