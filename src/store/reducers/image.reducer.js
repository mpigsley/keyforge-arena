import { FETCHED_IMAGE_LINKS } from 'store/actions/combined.actions';
import { FETCHED_CARD_LINKS } from 'store/actions/image.actions';

const initialState = {
  houses: {},
  cards: {},
};

export default function image(state = initialState, action) {
  switch (action.type) {
    case FETCHED_IMAGE_LINKS:
      return { ...state, houses: { ...state.houses, ...action.houses } };
    case FETCHED_CARD_LINKS:
      return { ...state, cards: { ...state.cards, ...action.cards } };
    default:
      return state;
  }
}
