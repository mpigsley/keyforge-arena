import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import Card from 'components/card';

import {
  CARD_RATIO,
  ZOOMED_WIDTH,
  MAX_CARD_WIDTH,
  VERTICAL_PADDING,
  HORIZONTAL_PADDING,
} from 'constants/game-board';
import { useDimensions } from 'utils/effects';
import { CardsType } from 'constants/types';

import styles from './styles.module.scss';

const CARD_PADDING = 10;
const DRAG_ATTRIBUTE = 'data-ignore-leave';
const FLANK = { LEFT: 'LEFT', RIGHT: 'RIGHT' };

export default function Battleline({
  cards,
  isOpponent,
  isDragging,
  playCreature,
  playerHouse,
}) {
  const [flank, setFlank] = useState();

  const cardNum = cards.length + (flank ? 1 : 0);
  const { height, width } = useDimensions();
  const battlelineHeight = height / 4 - VERTICAL_PADDING * 2;
  const paddingWidth = (cardNum - 1) * CARD_PADDING;
  const innerWidth = width - HORIZONTAL_PADDING * 2 - paddingWidth;
  const exhaustedNum = cards.filter(({ isExhausted }) => isExhausted).length;

  const defaultWidth =
    innerWidth / (cardNum - exhaustedNum + exhaustedNum / CARD_RATIO);
  const scaledWidth = Math.min(
    battlelineHeight * CARD_RATIO,
    defaultWidth,
    MAX_CARD_WIDTH,
  );
  const scaledHeight = scaledWidth / CARD_RATIO;
  const zoomScale = ZOOMED_WIDTH / scaledWidth;
  const cardsWidth = cardNum * scaledWidth + paddingWidth;
  const scaleOverhang = (ZOOMED_WIDTH - scaledWidth) / 2;
  const extraSideWidth = (width - cardsWidth) / 2;
  const needTranslate = scaleOverhang > extraSideWidth;

  let dragEvents;
  if (isDragging && !isOpponent) {
    dragEvents = {
      [DRAG_ATTRIBUTE]: true,
      onDragOver: e => e.preventDefault(),
      onDrop: e => {
        e.preventDefault();
        playCreature(e.dataTransfer.getData('card'), flank === FLANK.LEFT);
        setFlank();
      },
    };
  }

  let dropContainers;
  if (dragEvents) {
    dropContainers = (
      <>
        <div
          className={classNames(styles.drop, styles['drop--left'])}
          onDragEnter={() => setFlank(FLANK.LEFT)}
          {...dragEvents}
        />
        <div
          className={classNames(styles.drop, styles['drop--right'])}
          onDragEnter={() => setFlank(FLANK.RIGHT)}
          {...dragEvents}
        />
      </>
    );
  }

  return (
    <FlexContainer
      direction="column"
      className={styles.battleline}
      onDragLeave={e => {
        if (dragEvents && !e.relatedTarget.hasAttribute(DRAG_ATTRIBUTE)) {
          setFlank();
        }
      }}
      justify={isOpponent ? 'flexEnd' : 'flexStart'}
      style={{ padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px` }}
    >
      <FlexContainer justify="center" className={styles.inner}>
        {flank === FLANK.LEFT && (
          <div
            className={styles.cardOutline}
            style={{
              width: `${scaledWidth - 3}px`,
              height: `${scaledHeight - 3}px`,
              paddingRight: cardNum > 1 ? `${CARD_PADDING / 2 + 3}px` : 0,
            }}
          />
        )}
        {cards.map(({ expansion, card, house, isExhausted }, i) => (
          <div
            key={`${card}-${i}` /* eslint-disable-line */}
            className={styles.imgContainer}
            style={{
              height: `${scaledHeight}px`,
              width: `${isExhausted ? scaledHeight : scaledWidth}px`,
              paddingLeft:
                i !== 0 || flank === FLANK.LEFT ? `${CARD_PADDING / 2}px` : 0,
              paddingRight:
                i !== cardNum - 1 || flank === FLANK.RIGHT
                  ? `${CARD_PADDING / 2}px`
                  : 0,
            }}
          >
            <Card
              expansion={expansion}
              card={card}
              className={styles.card}
              isActive={house === playerHouse}
              isExhausted={isExhausted}
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
        {flank === FLANK.RIGHT && (
          <div
            className={styles.cardOutline}
            style={{
              width: `${scaledWidth - 3}px`,
              height: `${scaledHeight - 3}px`,
              paddingLeft: cardNum > 1 ? `${CARD_PADDING / 2 + 3}px` : 0,
            }}
          />
        )}
      </FlexContainer>
      {dropContainers}
    </FlexContainer>
  );
}

Battleline.propTypes = {
  isOpponent: PropTypes.bool,
  cards: CardsType.isRequired,
  isDragging: PropTypes.bool.isRequired,
  playCreature: PropTypes.func.isRequired,
  playerHouse: PropTypes.string.isRequired,
};

Battleline.defaultProps = {
  isOpponent: false,
};
