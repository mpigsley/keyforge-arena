import { SUBMITTING_NEW, SUBMITTED } from 'store/actions/deck.actions';

const initialState = {
  isSubmitting: false,
  models: null,
};

export default function deck(state = initialState, action) {
  switch (action.type) {
    case SUBMITTING_NEW:
      return { ...state, isSubmitting: true };
    case SUBMITTED:
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
}
