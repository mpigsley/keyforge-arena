import { LOCATION_CHANGE } from 'connected-react-router';
import { matchPath } from 'react-router';

import { SIGNED_OUT } from 'store/actions/user.actions';
import { GAMES_UPDATED } from 'store/actions/game.actions';

import { omit } from 'constants/lodash';

const initialState = { models: {}, selected: null };

export default function game(state = initialState, action) {
  switch (action.type) {
    case GAMES_UPDATED.SUCCESS:
      return {
        ...state,
        models: omit({ ...state.models, ...action.update }, ...action.deleted),
      };
    case LOCATION_CHANGE: {
      const { pathname } = action.payload.location;
      const routeMatch = matchPath(pathname, { path: `/game/:id/:rest?` });
      if (routeMatch) {
        return { ...state, selected: routeMatch.params.id };
      }
      return { ...state, selected: null };
    }
    case SIGNED_OUT.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
