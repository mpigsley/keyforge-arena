import React from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';

import { useDimensions } from 'utils/effects';
import styles from './styles.module.scss';

const CARD_WIDTH = 150;
const DEFAULT_OVERLAP = CARD_WIDTH * 0.6;

export default function Hand({ cards }) {
  const { width } = useDimensions();
  const handWidth = width / 2;
  const containerWidth = Math.min(
    handWidth,
    Math.max(0, (cards.length - 1) * DEFAULT_OVERLAP + CARD_WIDTH),
  );
  const isLimitedByWidth = containerWidth === handWidth;
  const overlap = isLimitedByWidth
    ? (handWidth - CARD_WIDTH) / (cards.length - 1)
    : DEFAULT_OVERLAP;

  return (
    <FlexContainer justify="center">
      <div
        className={styles.relativeContainer}
        style={{ width: containerWidth }}
      >
        {cards.map(({ image, house, card }, i) => (
          <img
            key={`${card}-${i}` /* eslint-disable-line */}
            src={image.link}
            alt={`${house}-${card}`}
            className={styles.card}
            style={{ left: i * overlap }}
          />
        ))}
      </div>
    </FlexContainer>
  );
}

Hand.propTypes = {
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

Hand.defaultProps = {};
