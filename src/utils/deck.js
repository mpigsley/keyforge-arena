import { uniq } from 'constants/lodash';

// eslint-disable-next-line
export const getUniqueCards = deck =>
  Object.values((deck || {}).houses || []).reduce(
    (arr, houseCards) => uniq([...arr, ...houseCards]),
    [],
  );
