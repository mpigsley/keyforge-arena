import { LOCATION_CHANGE } from 'connected-react-router';
import { matchPath } from 'react-router';

import { SIGNED_OUT } from 'store/actions/user.actions';
import {
  GAMES_UPDATED,
  GAME_INITIALIZED,
  CARD_MODAL_UPDATED,
} from 'store/actions/game.actions';

import { omit, mapValues } from 'constants/lodash';

const initialState = {
  models: {},
  selected: null,
  initializedGame: null,
  cardModal: null,
};

export default function game(state = initialState, action) {
  switch (action.type) {
    case GAMES_UPDATED.SUCCESS:
      return {
        ...state,
        models: omit(
          {
            ...state.models,
            ...mapValues(action.update, gameUpdate => ({
              ...gameUpdate,
              state: mapValues(gameUpdate.state, (gameState, uid) => ({
                ...gameState,
                ...(action.personal[uid] || {}),
              })),
            })),
          },
          ...action.deleted,
        ),
      };
    case GAME_INITIALIZED:
      return { ...state, initializedGame: action.key };
    case CARD_MODAL_UPDATED:
      return { ...state, cardModal: action.key };
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
