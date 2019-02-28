import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import CardBack from 'primitives/card-back';
import Card from 'components/card';

import {
  CARD_RATIO,
  MAX_MINOR_CARD_WIDTH,
  HORIZONTAL_PADDING,
  VERTICAL_PADDING,
} from 'constants/game-board';
import { CardsType } from 'constants/types';
import { useDimensions } from 'utils/effects';
import CARD_MODAL_TYPES from 'constants/card-modal-types';

import styles from './styles.module.scss';

const STATIC_PILE_WIDTH = 100;
const STATIC_PILE_HEIGHT = 75;

export default function CardPiles({
  className,
  isOpponent,
  numDraw,
  discarded,
  purged,
  numArchived,
  archived,
  updateCardModal,
  discardCard,
}) {
  const [isAcceptingCard, setIsAcceptingCard] = useState(false);
  const { height, width } = useDimensions();
  const modifiedPileWidth = isOpponent
    ? STATIC_PILE_WIDTH * 0.7
    : STATIC_PILE_WIDTH;
  const modifiedPileHeight = isOpponent
    ? STATIC_PILE_HEIGHT * 0.7
    : STATIC_PILE_HEIGHT;
  const innerHeight = height * (isOpponent ? 0.2 : 0.3) - VERTICAL_PADDING * 2;
  const innerWidth = width * (2 / 7) - HORIZONTAL_PADDING * 2;
  const horizontalCardWidth = Math.min(
    (innerWidth - VERTICAL_PADDING * 2 - modifiedPileWidth) / 2,
    innerHeight * CARD_RATIO,
  );
  const verticalCardWidth = Math.min(
    (innerHeight - VERTICAL_PADDING - modifiedPileHeight) * CARD_RATIO,
    (innerWidth - VERTICAL_PADDING) / 2,
  );
  const isVertical =
    verticalCardWidth > horizontalCardWidth ||
    (!purged.length && !archived.length && !numArchived);
  const cardWidth = Math.min(
    Math.max(verticalCardWidth, horizontalCardWidth),
    MAX_MINOR_CARD_WIDTH,
  );
  const cardHeight = Math.min(cardWidth / CARD_RATIO, innerHeight);
  const modifiedCardWidth = cardHeight * CARD_RATIO;

  const staticWidth = isVertical ? cardWidth : modifiedPileWidth;
  const staticHeight = isVertical
    ? modifiedPileHeight
    : (cardHeight - VERTICAL_PADDING) / 2;
  const staticContainerStyle = isVertical
    ? { marginBottom: VERTICAL_PADDING }
    : { marginLeft: VERTICAL_PADDING };

  const staticPiles = !!purged.length && (!!archived.length || !!numArchived) && (
    <FlexContainer
      direction={isVertical ? 'row' : 'column'}
      style={staticContainerStyle}
    >
      {!!purged.length && (
        <FlexContainer
          align="center"
          justify="center"
          direction="column"
          onClick={() =>
            updateCardModal(
              isOpponent
                ? CARD_MODAL_TYPES.OPPONENTS_PURGED_PILE.key
                : CARD_MODAL_TYPES.PURGED_PILE.key,
            )
          }
          className={styles.staticPile}
          style={{
            width: staticWidth,
            height: staticHeight,
            marginRight: isVertical ? VERTICAL_PADDING : 0,
            marginBottom: isVertical ? 0 : VERTICAL_PADDING,
          }}
        >
          <span className={styles.pileTitle}>Purged</span>
          <span className={styles.pileSize}>{purged.length}</span>
        </FlexContainer>
      )}
      {(!!archived.length || !!numArchived) && (
        <FlexContainer
          align="center"
          justify="center"
          direction="column"
          onClick={() => {
            if (!isOpponent) {
              updateCardModal(CARD_MODAL_TYPES.ARCHIVED_PILE.key);
            }
          }}
          className={styles.staticPile}
          style={{
            width: staticWidth,
            height: staticHeight,
          }}
        >
          <span className={styles.pileTitle}>Archived</span>
          <span className={styles.pileSize}>
            {archived.length || numArchived}
          </span>
        </FlexContainer>
      )}
    </FlexContainer>
  );

  const discardProps = {
    style: { width: modifiedCardWidth, height: cardHeight },
    onDragEnter: () => setIsAcceptingCard(true),
    onDragLeave: () => setIsAcceptingCard(false),
    onDragOver: e => e.preventDefault(),
    onDrop: e => {
      e.preventDefault();
      discardCard(e.dataTransfer.getData('card'));
      setIsAcceptingCard(false);
    },
  };

  let discardElement = (
    <FlexContainer
      {...discardProps}
      align="center"
      justify="center"
      direction="column"
      className={classNames(styles.emptyPile, {
        [styles['emptyPile--accepting']]: isAcceptingCard,
      })}
      style={{ width: modifiedCardWidth - 3, height: cardHeight - 3 }}
    >
      <span className={styles.pileTitle}>Discard Pile</span>
    </FlexContainer>
  );
  if (discarded.length) {
    const { expansion, card } = discarded[discarded.length - 1];
    discardElement = (
      <Card
        expansion={expansion}
        card={card}
        className={classNames(styles.discardPile, {
          [styles['discardPile--accepting']]: isAcceptingCard,
        })}
        onClick={() =>
          updateCardModal(
            isOpponent
              ? CARD_MODAL_TYPES.OPPONENTS_DISCARD_PILE.key
              : CARD_MODAL_TYPES.DISCARD_PILE.key,
          )
        }
        {...discardProps}
      />
    );
  }

  let drawElement = (
    <FlexContainer
      align="center"
      justify="center"
      direction="column"
      className={styles.emptyPile}
      style={{
        width: modifiedCardWidth - 3,
        height: cardHeight - 3,
        marginRight: VERTICAL_PADDING,
      }}
    >
      <span className={styles.pileTitle}>Draw</span>
    </FlexContainer>
  );
  if (numDraw) {
    drawElement = (
      <div
        className={styles.drawContainer}
        style={{ ...discardProps.style, marginRight: VERTICAL_PADDING }}
      >
        <FlexContainer
          align="center"
          justify="center"
          direction="column"
          className={styles.hoverData}
        >
          <span className={styles.pileTitle}>Deck</span>
          <span className={styles.pileSize}>{numDraw}</span>
        </FlexContainer>
        <CardBack width={modifiedCardWidth} />
      </div>
    );
  }

  return (
    <FlexContainer
      direction={isVertical ? 'column' : undefined}
      justify={isOpponent ? 'flexStart' : 'flexEnd'}
      className={classNames(styles.container, className)}
      style={{ padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px` }}
    >
      {isVertical && staticPiles}
      <FlexContainer
        className={classNames(styles.row, {
          [styles['row--horizontal']]: !isVertical,
          [styles['row--opponent']]: isOpponent,
        })}
      >
        {drawElement}
        {discardElement}
        {!isVertical && staticPiles}
      </FlexContainer>
    </FlexContainer>
  );
}

CardPiles.propTypes = {
  className: PropTypes.string,
  isOpponent: PropTypes.bool,
  numDraw: PropTypes.number.isRequired,
  discarded: CardsType.isRequired,
  purged: CardsType.isRequired,
  numArchived: PropTypes.number,
  archived: CardsType,
  updateCardModal: PropTypes.func.isRequired,
  discardCard: PropTypes.func.isRequired,
};

CardPiles.defaultProps = {
  isOpponent: false,
  className: undefined,
  numArchived: 0,
  archived: [],
};
