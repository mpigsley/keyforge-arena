import { SUBMITTED } from 'store/actions/deck.actions';

const initialState = {
  models: null,
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case SUBMITTED:
      return { ...state, decks: { ...state.decks, ...action.deck } };
    default:
      return state;
  }
}
