/* Session */
export const getAuthError = state => state.session.error;
export const getUser = state => state.session.model;
export const getIsLoggedIn = state => !!state.session.model;
export const getIsInitialized = state => state.session.isInitialized;
