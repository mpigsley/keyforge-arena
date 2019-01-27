import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';

import { CardsType } from 'constants/types';
import { useDimensions } from 'utils/effects';

import styles from './styles.module.scss';

const MAX_CARD_WIDTH = 140;
const CARD_RATIO = 300 / 420;
const HORIZONTAL_PADDING = 20;
const STATIC_PILE_WIDTH = 100;
const STATIC_PILE_HEIGHT = 75;
const PADDING = 8;

export default function CardPiles({
  className,
  numDraw,
  discarded,
  purged,
  archived,
}) {
  const { height, width } = useDimensions();
  const innerHeight = height * 0.3 - PADDING * 2;
  const innerWidth = width * (2 / 7) - HORIZONTAL_PADDING * 2;
  const horizontalCardWidth =
    (innerWidth - PADDING * 2 - STATIC_PILE_WIDTH) / 2;
  const verticalCardWidth =
    (innerHeight - PADDING - STATIC_PILE_HEIGHT) * CARD_RATIO;
  const isVertical = verticalCardWidth > horizontalCardWidth;
  const cardWidth = Math.min(
    Math.max(verticalCardWidth, horizontalCardWidth),
    MAX_CARD_WIDTH,
  );
  const cardHeight = cardWidth / CARD_RATIO;

  const staticWidth = isVertical ? cardWidth : STATIC_PILE_WIDTH;
  const staticHeight = isVertical
    ? STATIC_PILE_HEIGHT
    : (cardHeight - PADDING) / 2;
  const staticContainerStyle = isVertical
    ? { marginBottom: PADDING }
    : { marginLeft: PADDING };
  const staticPiles = (
    <FlexContainer
      direction={isVertical ? 'row' : 'column'}
      style={staticContainerStyle}
    >
      <div
        className={styles.purgePile}
        style={{
          width: staticWidth,
          height: staticHeight,
          marginRight: isVertical ? PADDING : 0,
          marginBottom: isVertical ? 0 : PADDING,
        }}
      />
      <div
        className={styles.archivePile}
        style={{ width: staticWidth, height: staticHeight }}
      />
    </FlexContainer>
  );

  return (
    <div
      className={classNames(styles.container, className)}
      style={{ padding: `${PADDING}px ${HORIZONTAL_PADDING}px` }}
    >
      {isVertical && staticPiles}
      <FlexContainer
        className={classNames({ [styles['row--horizontal']]: !isVertical })}
      >
        <div
          className={styles.drawPile}
          style={{ width: cardWidth, height: cardHeight, marginRight: PADDING }}
        />
        <div
          className={styles.discardPile}
          style={{ width: cardWidth, height: cardHeight }}
        />
        {!isVertical && staticPiles}
      </FlexContainer>
    </div>
  );
}

CardPiles.propTypes = {
  className: PropTypes.string,
  numDraw: PropTypes.number.isRequired,
  discarded: CardsType.isRequired,
  purged: CardsType.isRequired,
  archived: CardsType.isRequired,
};

CardPiles.defaultProps = {
  className: undefined,
};
