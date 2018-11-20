import { getCardLink } from 'store/api/image.api';
import { makeGetUnfetchedImageLinks } from 'store/selectors/image.selectors';

import { zipObject } from 'constants/lodash';

const ACTION_PREFIX = '@@image';
export const FETCHED_CARD_LINKS = `${ACTION_PREFIX}/FETCHED_CARD_LINKS`;

export const fetchCardImages = (expansion, cards) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const getUnfetchedLinks = makeGetUnfetchedImageLinks(expansion, cards);
  const unfetchedLinks = getUnfetchedLinks(state);

  if (!unfetchedLinks.length) {
    return;
  }

  const images = await Promise.all(
    unfetchedLinks.map(key => getCardLink(...key.split('-'))),
  );

  dispatch({
    type: FETCHED_CARD_LINKS,
    cards: zipObject(unfetchedLinks, images),
  });
};
