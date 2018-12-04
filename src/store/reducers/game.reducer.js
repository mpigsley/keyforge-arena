import { SIGNED_OUT } from 'store/actions/user.actions';
import { GAMES_UPDATED } from 'store/actions/game.actions';

import { omit } from 'constants/lodash';

const initialState = { models: {} };

export default function game(state = initialState, action) {
  switch (action.type) {
    case GAMES_UPDATED.SUCCESS:
      return {
        ...state,
        models: omit({ ...state.models, ...action.update }, ...action.deleted),
      };
    case SIGNED_OUT.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
