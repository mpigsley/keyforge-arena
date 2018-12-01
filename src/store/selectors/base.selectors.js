/* Connection */
export const getConnections = state => state.connection.models;
export const getConnectionError = state => state.connection.error;
export const getIsReplyingTo = state => state.connection.isReplyingTo;
export const getIsRequesting = state => state.connection.isRequesting;
export const getIsConnectModalOpen = state =>
  state.connection.isConnectModalOpen;
export const getAreConnectionsInitialized = state =>
  state.connection.isInitialized;

/* Deck */
export const getDecks = state => state.deck.models;
export const getDeckSearchTerm = state => state.deck.searchTerm;
export const getIsSubmitModalOpen = state => state.deck.isSubmitModalOpen;
export const getIsSubmittingDeck = state => state.deck.isSubmittingDeck;
export const getIsChangeModalOpen = state => state.deck.isChangeModalOpen;
export const getIsChangingSelected = state => state.deck.isChangingSelected;
export const getIsDecksInitialized = state => state.deck.isInitialized;
export const getDeckError = state => state.deck.error;

/* Image */
export const getHouseImages = state => state.image.houses;
export const getCardImages = state => state.image.cards;

/* Lobby */
export const getLobbies = state => state.lobby.models;

/* Router */
export const getPathname = state => state.router.location.pathname;

/* User */
export const getUserError = state => state.user.error;
export const getUser = state => state.user.model;
export const getUserId = state => (state.user.model || {}).uid;
export const getUserTag = state => (state.user.model || {}).tag;
export const getUserForm = state => state.user.userForm;
export const getLoginForm = state => state.user.loginForm;
export const getIsLoggedIn = state => !!(state.user.model || {}).uid;
export const getIsLoggingIn = state => state.user.isLoggingIn;
export const getIsLoginModalOpen = state => state.user.isLoginModalOpen;
export const getIsInitialized = state => state.user.isInitialized;
