import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import Card from 'components/card';

import {
  CARD_RATIO,
  ZOOMED_WIDTH,
  HORIZONTAL_PADDING,
  VERTICAL_PADDING,
} from 'constants/game-board';
import { useDimensions } from 'utils/effects';
import { CardsType } from 'constants/types';

import styles from './styles.module.scss';

const CARD_PADDING = 10;

export default function Battleline({
  cards,
  isOpponent,
  isDragging,
  playCreature,
}) {
  const [isAcceptingCard, setIsAcceptingCard] = useState(false);
  const cardNum = cards.length + (isAcceptingCard ? 1 : 0);
  const { height, width } = useDimensions();
  const battlelineHeight = height / 4 - VERTICAL_PADDING * 2;
  const paddingWidth = (cardNum - 1) * CARD_PADDING;
  const innerWidth = width - HORIZONTAL_PADDING * 2 - paddingWidth;

  const defaultWidth = innerWidth / cardNum;
  const scaledWidth = Math.min(
    battlelineHeight * CARD_RATIO,
    defaultWidth,
    150,
  );
  const zoomScale = ZOOMED_WIDTH / scaledWidth;
  const cardsWidth = cardNum * scaledWidth + paddingWidth;
  const scaleOverhang = (ZOOMED_WIDTH - scaledWidth) / 2;
  const extraSideWidth = (width - cardsWidth) / 2;
  const needTranslate = scaleOverhang > extraSideWidth;

  let dragEvents = {};
  if (!isOpponent) {
    dragEvents = {
      onDragEnter: () => setIsAcceptingCard(true),
      onDragLeave: () => setIsAcceptingCard(false),
      onDragOver: e => e.preventDefault(),
      onDrop: e => {
        e.preventDefault();
        playCreature(e.dataTransfer.getData('card'));
        setIsAcceptingCard(false);
      },
    };
  }

  return (
    <FlexContainer
      {...dragEvents}
      direction="column"
      className={styles.battleline}
      justify={isOpponent ? 'flexEnd' : 'flexStart'}
      style={{ padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px` }}
    >
      <FlexContainer justify="center" className={styles.inner}>
        {isAcceptingCard && (
          <div
            className={styles.cardOutline}
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledWidth / CARD_RATIO}px`,
              paddingRight: cardNum > 1 ? `${CARD_PADDING / 2}px` : 0,
            }}
          />
        )}
        {cards.map(({ expansion, card }, i) => (
          <div
            key={`${card}-${i}` /* eslint-disable-line */}
            className={styles.imgContainer}
            style={{
              width: `${scaledWidth}px`,
              paddingLeft:
                i !== 0 || isAcceptingCard ? `${CARD_PADDING / 2}px` : 0,
              paddingRight: i !== cardNum - 1 ? `${CARD_PADDING / 2}px` : 0,
            }}
          >
            <Card
              expansion={expansion}
              card={card}
              className={classNames(styles.card, {
                [styles['card--accepting']]: isDragging,
              })}
              onMouseEnter={e => {
                const offset = (ZOOMED_WIDTH - scaledWidth) / (zoomScale * 2);
                if (i === 0 && needTranslate) {
                  e.target.style.transform = `scale(${zoomScale}) translate(${offset}px)`;
                } else if (i === cardNum - 1 && needTranslate) {
                  e.target.style.transform = `scale(${zoomScale}) translate(-${offset}px)`;
                } else {
                  e.target.style.transform = `scale(${zoomScale})`;
                }
              }}
              onMouseLeave={e => {
                e.target.style.transform = '';
              }}
            />
          </div>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
}

Battleline.propTypes = {
  isOpponent: PropTypes.bool,
  cards: CardsType.isRequired,
  isDragging: PropTypes.bool.isRequired,
  playCreature: PropTypes.func.isRequired,
};

Battleline.defaultProps = {
  isOpponent: false,
};
