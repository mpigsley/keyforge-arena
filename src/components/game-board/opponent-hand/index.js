import React from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';
import CardBack from 'primitives/card-back';

import { MAX_CARD_WIDTH } from 'constants/game-board';
import { useDimensions } from 'utils/effects';
import styles from './styles.module.scss';

const DEFAULT_OVERLAP = MAX_CARD_WIDTH * 0.6;

export default function OpponentHand({ handSize }) {
  const { width } = useDimensions();
  const handWidth = width * (3 / 7);
  const containerWidth = Math.min(
    handWidth,
    Math.max(0, (handSize - 1) * DEFAULT_OVERLAP + MAX_CARD_WIDTH),
  );
  const overlap =
    containerWidth === handWidth
      ? (handWidth - MAX_CARD_WIDTH) / (handSize - 1)
      : DEFAULT_OVERLAP;

  return (
    <FlexContainer justify="center">
      <div
        style={{ width: containerWidth }}
        className={styles.relativeContainer}
      >
        {[...Array(handSize)].map((_, i) => (
          <CardBack
            key={i /* eslint-disable-line */}
            isFlipped
            isOutlined
            className={styles.card}
            width={MAX_CARD_WIDTH}
            style={{ left: i * overlap }}
          />
        ))}
      </div>
    </FlexContainer>
  );
}

OpponentHand.propTypes = {
  handSize: PropTypes.number.isRequired,
};
