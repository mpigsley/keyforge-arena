import { INITIALIZED_GAME } from 'store/actions/combined.actions';
import {
  FETCHED_CARD_LINKS,
  FETCHED_HOUSE_LINKS,
} from 'store/actions/image.actions';

const initialState = {
  houses: {},
  cards: {},
};

export default function image(state = initialState, action) {
  switch (action.type) {
    case FETCHED_HOUSE_LINKS.SUCCESS:
      return { ...state, houses: { ...state.houses, ...action.houses } };
    case FETCHED_CARD_LINKS:
    case INITIALIZED_GAME:
      return { ...state, cards: { ...state.cards, ...action.cards } };
    default:
      return state;
  }
}
