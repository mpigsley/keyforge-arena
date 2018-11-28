import { CHALLENGE, LOBBIES_UPDATED } from 'store/actions/lobby.actions';
import { SIGNED_OUT } from 'store/actions/user.actions';

const initialState = {
  models: {},
};

export default function lobby(state = initialState, action) {
  switch (action.type) {
    case CHALLENGE.SUCCESS:
    case LOBBIES_UPDATED.SUCCESS:
      return { ...state, models: { ...state.models, ...action.update } };
    case SIGNED_OUT.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
