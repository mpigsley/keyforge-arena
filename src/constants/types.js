import PropTypes from 'prop-types';

export const CardType = PropTypes.shape({
  image: PropTypes.shape({
    link: PropTypes.string.isRequired,
  }).isRequired,
  house: PropTypes.string.isRequired,
  card: PropTypes.string.isRequired,
});

export const CardsType = PropTypes.arrayOf(CardType.isRequired);
