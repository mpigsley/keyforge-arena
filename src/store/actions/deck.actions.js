import { submitDeck } from 'store/api/deck.api';

const ACTION_PREFIX = '@@combined';
export const SUBMITTING_NEW = `${ACTION_PREFIX}/SUBMITTING_NEW`;
export const SUBMITTED = `${ACTION_PREFIX}/SUBMITTED`;

export const submitNewDeck = link => dispatch => {
  dispatch({ type: SUBMITTING_NEW });
  return submitDeck(link).then(response => {
    console.log(response); // eslint-disable-line
    dispatch({ type: SUBMITTED });
  });
};
