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
  isOpponent,
  numDraw,
  discarded,
  purged,
  archived,
}) {
  const modifiedPileWidth = isOpponent
    ? STATIC_PILE_WIDTH * 0.7
    : STATIC_PILE_WIDTH;
  const modifiedPileHeight = isOpponent
    ? STATIC_PILE_HEIGHT * 0.7
    : STATIC_PILE_HEIGHT;
  const { height, width } = useDimensions();
  const innerHeight = height * (isOpponent ? 0.2 : 0.3) - PADDING * 2;
  const innerWidth = width * (2 / 7) - HORIZONTAL_PADDING * 2;
  const horizontalCardWidth =
    (innerWidth - PADDING * 2 - modifiedPileWidth) / 2;
  const verticalCardWidth =
    (innerHeight - PADDING - modifiedPileHeight) * CARD_RATIO;
  const isVertical = verticalCardWidth > horizontalCardWidth;
  const cardWidth = Math.min(
    Math.max(verticalCardWidth, horizontalCardWidth),
    MAX_CARD_WIDTH,
  );
  const cardHeight = Math.min(cardWidth / CARD_RATIO, innerHeight);
  const modifiedCardWidth = cardHeight * CARD_RATIO;

  const staticWidth = isVertical ? cardWidth : modifiedPileWidth;
  const staticHeight = isVertical
    ? modifiedPileHeight
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
        style={{
          width: staticWidth,
          height: staticHeight,
        }}
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
        className={classNames({
          [styles['row--horizontal']]: !isVertical,
          [styles['row--opponent']]: isOpponent,
        })}
      >
        <div
          className={styles.drawPile}
          style={{
            width: modifiedCardWidth,
            height: cardHeight,
            marginRight: PADDING,
          }}
        />
        <div
          className={styles.discardPile}
          style={{ width: modifiedCardWidth, height: cardHeight }}
        />
        {!isVertical && staticPiles}
      </FlexContainer>
    </div>
  );
}

CardPiles.propTypes = {
  className: PropTypes.string,
  isOpponent: PropTypes.bool,
  numDraw: PropTypes.number.isRequired,
  discarded: CardsType.isRequired,
  purged: CardsType.isRequired,
  archived: CardsType.isRequired,
};

CardPiles.defaultProps = {
  isOpponent: false,
  className: undefined,
};
