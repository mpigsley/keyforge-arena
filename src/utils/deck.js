import { uniq } from 'constants/lodash';
import Chance from 'chance';

const { shuffle } = new Chance();

export const getUniqueCards = deck =>
  Object.values((deck || {}).houses || []).reduce(
    (arr, houseCards) => uniq([...arr, ...houseCards]),
    [],
  );

export const getAllCards = deck =>
  Object.values((deck || {}).houses || []).reduce(
    (arr, houseCards) => [...arr, ...houseCards],
    [],
  );

export const shuffleDeck = deck => shuffle(getAllCards(deck));
