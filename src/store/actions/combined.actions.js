import { push } from 'connected-react-router';

import { getCardLink } from 'store/api/image.api';
import { getDecks } from 'store/api/deck.api';
import { getGame } from 'store/api/game.api';

import { makeGetUnfetchedImageLinks } from 'store/selectors/image.selectors';

import { uniq } from 'constants/lodash';
import { getUniqueCards } from 'utils/deck';

const ACTION_PREFIX = '@@combined';
export const INITIALIZED_GAME = `${ACTION_PREFIX}/INITIALIZED_GAME`;

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
