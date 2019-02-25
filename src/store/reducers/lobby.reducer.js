import {
  CHALLENGE,
  CANCEL_CHALLENGE,
  ACCEPT_CHALLENGE,
  LOBBIES_UPDATED,
} from 'store/actions/lobby.actions';
import { SIGNED_OUT } from 'store/actions/user.actions';
import { omit, includes } from 'constants/lodash';

const initialState = {
  isCancelling: undefined,
  isAccepting: undefined,
  currentLobby: undefined,
  models: {},
};

export default function lobby(state = initialState, action) {
  switch (action.type) {
    case LOBBIES_UPDATED.SUCCESS:
      return {
        ...state,
        models: omit({ ...state.models, ...action.update }, ...action.deleted),
        currentLobby: includes(action.deleted, state.currentLobby)
          ? undefined
          : state.currentLobby,
      };
    case CHALLENGE.SUCCESS:
      return { ...state, currentLobby: action.lobby };
    case CANCEL_CHALLENGE.PENDING:
      return { ...state, isCancelling: action.challenge };
    case CANCEL_CHALLENGE.SUCCESS:
    case CANCEL_CHALLENGE.ERROR:
      return { ...state, currentLobby: undefined, isCancelling: undefined };
    case ACCEPT_CHALLENGE.PENDING:
      return { ...state, isAccepting: action.challenge };
    case ACCEPT_CHALLENGE.SUCCESS:
    case ACCEPT_CHALLENGE.ERROR:
      return { ...state, isAccepting: undefined };
    case SIGNED_OUT.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
