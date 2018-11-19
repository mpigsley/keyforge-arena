import { FETCHED_IMAGE_LINKS } from 'store/actions/combined.actions';
import Sets from 'constants/expansions';

const initialState = {
  houses: {},
  cards: Object.keys(Sets).reduce((obj, set) => ({ ...obj, [set]: {} }), {}),
};

export default function image(state = initialState, action) {
  switch (action.type) {
    case FETCHED_IMAGE_LINKS:
      return { ...state, houses: { ...state.houses, ...action.houses } };
    default:
      return state;
  }
}
