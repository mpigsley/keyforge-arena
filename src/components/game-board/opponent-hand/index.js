import React from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';

import Logo from 'images/logo.png';
import { useDimensions } from 'utils/effects';
import styles from './styles.module.scss';

const CARD_RATIO = 300 / 420;
const CARD_WIDTH = 130;
const EXTRA_PADDING = 10;
const DEFAULT_OVERLAP = CARD_WIDTH * 0.6;

export default function OpponentHand({ handSize }) {
  const { width } = useDimensions();
  const handWidth = width / 2;
  const containerWidth = Math.min(
    handWidth,
    Math.max(0, (handSize - 1) * DEFAULT_OVERLAP + CARD_WIDTH),
  );
  const overlap =
    containerWidth === handWidth
      ? (handWidth - CARD_WIDTH) / (handSize - 1)
      : DEFAULT_OVERLAP;

  return (
    <FlexContainer justify="center">
      <div
        style={{ width: containerWidth }}
        className={styles.relativeContainer}
      >
        {[...Array(handSize)].map((_, i) => (
          <FlexContainer
            key={i /* eslint-disable-line */}
            className={styles.card}
            align="center"
            justify="center"
            style={{
              left: i * overlap,
              width: CARD_WIDTH,
              height: CARD_WIDTH / CARD_RATIO,
            }}
          >
            <img className={styles.logo} alt="logo" src={Logo} />
          </FlexContainer>
        ))}
      </div>
    </FlexContainer>
  );
}

OpponentHand.propTypes = {
  handSize: PropTypes.number.isRequired,
};
