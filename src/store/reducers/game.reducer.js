import { LOCATION_CHANGE } from 'connected-react-router';
import { INITIALIZED_GAME } from 'store/actions/combined.actions';
import { SIGNED_OUT } from 'store/actions/session.actions';

const initialState = {
  isInitialized: false,
  gameId: null,
  playerDecks: {},
};

export default function game(state = initialState, action) {
  switch (action.type) {
    case INITIALIZED_GAME:
      return {
        ...state,
        isInitialized: true,
        gameId: action.gameId,
        playerDecks: action.playerDecks,
      };
    case LOCATION_CHANGE:
    case SIGNED_OUT.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
