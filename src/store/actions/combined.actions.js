import { push } from 'connected-react-router';

import { getHouseLink, getCardLink } from 'store/api/image.api';
import { getDecksByUser, getDecks } from 'store/api/deck.api';
import { getCurrentUser } from 'store/api/session.api';
import { getGame } from 'store/api/game.api';

import { makeGetUnfetchedImageLinks } from 'store/selectors/image.selectors';

import Houses from 'constants/houses';
import { uniq, zipObject } from 'constants/lodash';
import { getUniqueCards } from 'utils/deck';

const ACTION_PREFIX = '@@combined';
export const INITIALIZED_APP = `${ACTION_PREFIX}/INITIALIZED_APP`;
export const INITIALIZED_GAME = `${ACTION_PREFIX}/INITIALIZED_GAME`;
export const FETCHED_IMAGE_LINKS = `${ACTION_PREFIX}/FETCHED_IMAGE_LINKS`;

export const initializeApp = user => async dispatch => {
  const currentUser = user || (await getCurrentUser());
  let decks;
  if (currentUser) {
    decks = await getDecksByUser(currentUser.uid);
  }
  const houseList = Object.keys(Houses);
  const houses = await Promise.all(houseList.map(getHouseLink));
  dispatch({
    type: INITIALIZED_APP,
    houses: zipObject(houseList, houses),
    user: currentUser,
    decks,
  });
  dispatch(push('/dashboard'));
};

export const initializeGame = gameId => async (dispatch, getState) => {
  const game = await getGame(gameId);
  if (!game) {
    return dispatch(push('/'));
  }
  const decks = await getDecks(Object.values(game.decks));

  const state = getState();
  const unfetchedLinks = Object.values(decks).reduce((arr, deck) => {
    const getUnfetchedLinks = makeGetUnfetchedImageLinks(
      deck.expansion,
      getUniqueCards(deck),
    );
    return uniq([...arr, ...getUnfetchedLinks(state)]);
  }, []);

  const cards = await Promise.all(
    unfetchedLinks.map(key => getCardLink(...key.split('-'))),
  );

  return dispatch({
    type: INITIALIZED_GAME,
    playerDecks: game.decks,
    gameId,
    cards,
    decks,
  });
};
