import { LOCATION_CHANGE } from 'connected-react-router';
import { matchPath } from 'react-router';

import { SIGNED_OUT } from 'store/actions/user.actions';
import {
  GAME_UPDATED,
  GAME_INITIALIZED,
  SEQUENCE_UPDATED,
  CARD_MODAL_UPDATED,
  GAME_ACTION_HANDLED,
} from 'store/actions/game.actions';
import GAME_SEQUENCE from 'constants/game-sequence.json';

const initialState = {
  models: {},
  sequence: undefined,
  selected: undefined,
  initializedGame: false,
  isHandlingAction: false,
  cardModal: undefined,
};

export default function game(state = initialState, action) {
  switch (action.type) {
    case GAME_UPDATED.SUCCESS:
      return {
        ...state,
        models: {
          ...state.models,
          [action.gameId]: action.game,
        },
      };
    case GAME_INITIALIZED:
      return {
        ...state,
        initializedGame: true,
        sequence: GAME_SEQUENCE.OPPONENT.key,
      };
    case CARD_MODAL_UPDATED:
      return { ...state, cardModal: action.key };
    case SEQUENCE_UPDATED:
      return { ...state, sequence: action.sequence };
    case GAME_ACTION_HANDLED.PENDING:
      return { ...state, isHandlingAction: true };
    case GAME_ACTION_HANDLED.SUCCESS:
    case GAME_ACTION_HANDLED.ERROR:
      return { ...state, isHandlingAction: false };
    case LOCATION_CHANGE: {
      const { pathname } = action.payload.location;
      const routeMatch = matchPath(pathname, { path: `/game/:id/:rest?` });
      if (routeMatch) {
        return { ...state, selected: routeMatch.params.id };
      }
      return { ...state, selected: undefined };
    }
    case SIGNED_OUT.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
