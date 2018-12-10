import React from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';

import styles from './styles.module.scss';

export default function Battleline({ cards }) {
  return (
    <FlexContainer justify="center">
      {cards.map(({ image, house, card }, i) => (
        <div
          key={`${card}-${i}` /* eslint-disable-line */}
          className={styles.imgContainer}
        >
          <img
            src={image.link}
            alt={`${house}-${card}`}
            className={styles.card}
          />
        </div>
      ))}
    </FlexContainer>
  );
}

Battleline.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.shape({
        link: PropTypes.string.isRequired,
      }).isRequired,
      house: PropTypes.string.isRequired,
      card: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
