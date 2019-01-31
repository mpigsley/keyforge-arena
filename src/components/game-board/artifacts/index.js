import React from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';

import {
  CARD_RATIO,
  HORIZONTAL_PADDING,
  VERTICAL_PADDING,
  MAX_CARD_WIDTH,
} from 'constants/game-board';
import { CardsType } from 'constants/types';
import { useDimensions } from 'utils/effects';

import styles from './styles.module.scss';

export default function Artifacts({ className, artifacts, isOpponent }) {
  const { height, width } = useDimensions();
  const innerHeight = height * (isOpponent ? 0.2 : 0.3) - VERTICAL_PADDING * 2;
  const innerWidth = width * (2 / 7) - HORIZONTAL_PADDING * 2;

  const cardWidth = Math.min(
    (innerWidth - (artifacts.length - 1) * VERTICAL_PADDING) / artifacts.length,
    MAX_CARD_WIDTH,
  );
  console.log(cardWidth / CARD_RATIO, innerHeight);
  const cardHeight = Math.min(cardWidth / CARD_RATIO, innerHeight);
  const modifiedCardWidth = cardHeight * CARD_RATIO;

  return (
    <FlexContainer
      className={className}
      align={isOpponent ? 'flexStart' : 'flexEnd'}
      justify="flexEnd"
      style={{ padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px` }}
    >
      {artifacts.map(({ card, image }, i) => (
        <img
          key={`${card}-${i}` /* eslint-disable-line */}
          className={styles.discardPile}
          alt={card}
          src={image.link}
          style={{
            height: cardHeight,
            width: modifiedCardWidth,
            paddingLeft: i !== 0 ? `${VERTICAL_PADDING / 2}px` : 0,
            paddingRight:
              i !== artifacts.length - 1 ? `${VERTICAL_PADDING / 2}px` : 0,
          }}
        />
      ))}
    </FlexContainer>
  );
}

Artifacts.propTypes = {
  className: PropTypes.string.isRequired,
  artifacts: CardsType.isRequired,
  isOpponent: PropTypes.bool,
};

Artifacts.defaultProps = {
  isOpponent: false,
};
