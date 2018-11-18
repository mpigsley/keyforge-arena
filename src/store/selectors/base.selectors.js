/* Decks */
export const getDeckSearchTerm = state => state.deck.searchTerm;
export const getDecks = state => state.deck.models;

/* Session */
export const getAuthError = state => state.session.error;
export const getUser = state => state.session.model;
export const getIsLoggedIn = state => !!state.session.model;
export const getIsInitialized = state => state.session.isInitialized;
