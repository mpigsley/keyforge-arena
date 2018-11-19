import { getCardLink } from 'store/api/image.api';
import { getCardImages } from 'store/selectors/base.selectors';

import { difference, zipObject } from 'constants/lodash';

const ACTION_PREFIX = '@@image';
export const FETCHED_CARD_LINKS = `${ACTION_PREFIX}/FETCHED_CARD_LINKS`;

export const fetchCardImages = (expansion, cards) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const cardImages = getCardImages(state);
  const otherImages = difference(
    cards.map(card => `${expansion}-${card}`),
    Object.keys(cardImages),
  );

  if (!otherImages.length) {
    return;
  }

  const images = await Promise.all(
    otherImages.map(key => getCardLink(...key.split('-'))),
  );

  dispatch({
    type: FETCHED_CARD_LINKS,
    cards: zipObject(otherImages, images),
  });
};
