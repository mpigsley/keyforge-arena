import { createSelector } from 'reselect';
import { getCardImages } from 'store/selectors/base.selectors';
import { difference } from 'constants/lodash';

// eslint-disable-next-line
export const makeGetUnfetchedImageLinks = (expansion, newImageIds) => {
  return createSelector(
    [getCardImages],
    cardImages =>
      difference(
        newImageIds.map(id => `${expansion}-${id}`),
        Object.keys(cardImages),
      ),
  );
};
