import { submitDeck } from 'store/api/deck.api';

const ACTION_PREFIX = '@@deck';
export const SUBMITTED = `${ACTION_PREFIX}/SUBMITTED`;

export const submitNewDeck = link => dispatch =>
  submitDeck(link).then(deck => {
    console.log(deck); // eslint-disable-line
    dispatch({ type: SUBMITTED, deck });
  });
