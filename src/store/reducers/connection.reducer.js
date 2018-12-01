import {
  UPDATE,
  REPLY,
  REQUEST,
  UNSET_ERROR,
  TOGGLED_CONNECT_MODAL,
} from 'store/actions/connection.actions';
import { SIGNED_OUT } from 'store/actions/user.actions';
import { omit } from 'constants/lodash';

const initialState = {
  models: {},
  isInitialized: false,
  isConnectModalOpen: false,
  isRequesting: false,
  isReplyingTo: null,
  error: null,
};

export default function connection(state = initialState, action) {
  switch (action.type) {
    case UPDATE.SUCCESS:
      return {
        ...state,
        isInitialized: true,
        models: { ...state.models, ...action.connections },
      };
    case TOGGLED_CONNECT_MODAL:
      return { ...state, isConnectModalOpen: !state.isConnectModalOpen };
    case REQUEST.PENDING:
      return { ...state, error: null, isRequesting: true };
    case REQUEST.ERROR:
      return { ...state, error: action.error, isRequesting: false };
    case REQUEST.SUCCESS:
      return { ...state, isRequesting: false, isConnectModalOpen: false };
    case UNSET_ERROR:
      return { ...state, error: null };
    case REPLY.PENDING:
      return { ...state, error: null, isReplyingTo: action.connection };
    case REPLY.ERROR:
      return { ...state, error: action.error, isReplyingTo: null };
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
