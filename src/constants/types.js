import PropTypes from 'prop-types';

export const CardType = PropTypes.shape({
  house: PropTypes.string.isRequired,
  expansion: PropTypes.string.isRequired,
  card: PropTypes.string.isRequired,
});

export const CardsType = PropTypes.arrayOf(CardType);

export const UserGameState = PropTypes.shape({
  aember: PropTypes.number,
  keyCost: PropTypes.number,
  archived: CardsType,
  archiveSize: PropTypes.number,
  artifacts: CardsType,
  battlelines: CardsType,
  deck: PropTypes.string,
  deckSize: PropTypes.number,
  discard: CardsType,
  hand: CardsType,
  handSize: PropTypes.number,
  house: PropTypes.string,
  keys: PropTypes.number,
  purged: CardsType,
  turn: PropTypes.number,
});
