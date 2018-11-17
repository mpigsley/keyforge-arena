import { getCurrentUser } from 'store/api/session.api';
import { getDecks } from 'store/api/deck.api';

const ACTION_PREFIX = '@@combined';
export const INITIALIZED = `${ACTION_PREFIX}/INITIALIZED`;

export const initialize = () => async dispatch => {
  const user = await getCurrentUser();
  let decks;
  if (user) {
    decks = await getDecks(user.uid);
  }
  dispatch({ type: INITIALIZED, user, decks });
};
