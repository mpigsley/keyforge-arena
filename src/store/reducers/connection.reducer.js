import { UPDATE } from 'store/actions/connection.actions';

const initialState = {
  models: {},
  isInitialized: false,
};

export default function connection(state = initialState, action) {
  switch (action.type) {
    case UPDATE.SUCCESS:
      return {
        ...state,
        isInitialized: true,
        models: { ...state.models, ...action.connections },
      };
    default:
      return state;
  }
}
