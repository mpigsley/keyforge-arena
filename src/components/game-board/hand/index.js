import React from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';

import { useDimensions } from 'utils/effects';
import styles from './styles.module.scss';

const CARD_RATIO = 300 / 420;
const CARD_WIDTH = 130;
const ZOOMED_WIDTH = 250;
const EXTRA_PADDING = 10;
const DEFAULT_OVERLAP = CARD_WIDTH * 0.6;

export default function Hand({ cards }) {
  const { width, height } = useDimensions();
  const handWidth = width / 2;
  const handHeight = height * 0.18;
  const containerWidth = Math.min(
    handWidth,
    Math.max(0, (cards.length - 1) * DEFAULT_OVERLAP + CARD_WIDTH),
  );
  const zoomScale = ZOOMED_WIDTH / CARD_WIDTH;
  const overlap =
    containerWidth === handWidth
      ? (handWidth - CARD_WIDTH) / (cards.length - 1)
      : DEFAULT_OVERLAP;

  const scaleDiff = (ZOOMED_WIDTH - CARD_WIDTH) / (CARD_RATIO * 2);
  const offset =
    CARD_WIDTH / CARD_RATIO + scaleDiff + EXTRA_PADDING - handHeight;

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
            onMouseEnter={e => {
              e.target.style.transform = `translateY(${-offset}px) scale(${zoomScale})`;
            }}
            onMouseLeave={e => {
              e.target.style.transform = '';
            }}
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
