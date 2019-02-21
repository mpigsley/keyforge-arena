import PropTypes from 'prop-types';

export const CardType = PropTypes.shape({
  image: PropTypes.shape({
    link: PropTypes.string.isRequired,
  }).isRequired,
  house: PropTypes.string.isRequired,
  expansion: PropTypes.string.isRequired,
  card: PropTypes.string.isRequired,
});

export const CardsType = PropTypes.arrayOf(CardType.isRequired);

export const UserGameState = PropTypes.shape({
  aember: PropTypes.number.isRequired,
  keyCost: PropTypes.number.isRequired,
  archived: CardsType,
  archiveSize: PropTypes.number.isRequired,
  artifacts: CardsType.isRequired,
  battlelines: CardsType.isRequired,
  deck: PropTypes.string.isRequired,
  deckSize: PropTypes.number.isRequired,
  discard: CardsType.isRequired,
  hand: CardsType,
  handSize: PropTypes.number.isRequired,
  house: PropTypes.string.isRequired,
  keys: PropTypes.number.isRequired,
  purged: CardsType.isRequired,
  turn: PropTypes.number.isRequired,
});
