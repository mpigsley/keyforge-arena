import { UPDATE, REPLY } from 'store/actions/connection.actions';
import { SIGNED_OUT } from 'store/actions/user.actions';
import { omit } from 'constants/lodash';

const initialState = {
  models: {},
  isInitialized: false,
  isReplyingTo: null,
};

export default function connection(state = initialState, action) {
  switch (action.type) {
    case UPDATE.SUCCESS:
      return {
        ...state,
        isInitialized: true,
        models: { ...state.models, ...action.connections },
      };
    case REPLY.PENDING:
      return { ...state, isReplyingTo: action.connection };
    case REPLY.ERROR:
      return { ...state, isReplyingTo: null };
    case REPLY.SUCCESS: {
      let models = omit(state.models, action.connection);
      if (action.accepted) {
        models = {
          ...state.models,
          [action.connection]: {
            ...state.models[action.connection],
            pending: false,
          },
        };
      }
      return { ...state, isReplyingTo: null, models };
    }
    case SIGNED_OUT.SUCCESS:
      return initialState;
    default:
      return state;
  }
}
