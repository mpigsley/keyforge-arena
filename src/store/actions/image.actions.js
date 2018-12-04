import { createAsyncTypes } from 'utils/store';

const ACTION_PREFIX = '@@image';
export const FETCHED_CARD_LINKS = createAsyncTypes(
  `${ACTION_PREFIX}/FETCHED_CARD_LINKS`,
);
export const FETCHED_HOUSE_LINKS = createAsyncTypes(
  `${ACTION_PREFIX}/FETCHED_HOUSE_LINKS`,
);

export const fetchCardImages = (expansion, deck) => ({
  type: FETCHED_CARD_LINKS.PENDING,
  expansion,
  deck,
});
