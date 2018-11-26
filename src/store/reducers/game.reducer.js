import { LOCATION_CHANGE } from 'connected-react-router';
import { SIGNED_OUT } from 'store/actions/user.actions';

const initialState = {};

export default function game(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
    case SIGNED_OUT.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
