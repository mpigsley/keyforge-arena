import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import CardOutline from 'primitives/card-outline';
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
  isDraggedCreature,
  isDraggedUpgrade,
  playCreature,
  playUpgrade,
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
  if (isDraggedCreature && !isOpponent) {
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
        {isDraggedCreature && !isOpponent && (
          <CardOutline
            isActive={cards.length ? flank === FLANK.LEFT : !!flank}
            title={cards.length ? 'Left Creature Flank' : 'Play Creature'}
            width={scaledWidth}
            height={scaledHeight}
            style={{
              paddingRight: cardNum > 1 ? `${CARD_PADDING / 2 + 3}px` : 0,
            }}
          />
        )}
        {cards.map(({ key, expansion, card, house, isExhausted }, i) => (
          <div
            key={key}
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
              className={styles.card}
              isActive={
                !isOpponent &&
                ((!isExhausted && house === playerHouse) || isDraggedUpgrade)
              }
              isExhausted={isExhausted}
              expansion={expansion}
              card={card}
              onDragOver={e => {
                if (isDraggedUpgrade) {
                  e.preventDefault();
                }
              }}
              onDrop={e => {
                e.preventDefault();
                playUpgrade(e.dataTransfer.getData('card'), key);
              }}
              onContextMenu={e => {
                e.preventDefault();
                const offset = (ZOOMED_WIDTH - scaledWidth) / (zoomScale * 2);
                e.target.parentNode.style.zIndex = 100;
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
                e.target.parentNode.style.zIndex = 1;
              }}
            />
          </div>
        ))}
        {isDraggedCreature && !isOpponent && !!cards.length && (
          <CardOutline
            isActive={flank === FLANK.RIGHT}
            title="Right Creature Flank"
            width={scaledWidth}
            height={scaledHeight}
            style={{
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
  isDraggedCreature: PropTypes.bool.isRequired,
  isDraggedUpgrade: PropTypes.bool.isRequired,
  playCreature: PropTypes.func.isRequired,
  playUpgrade: PropTypes.func.isRequired,
  playerHouse: PropTypes.string.isRequired,
};

Battleline.defaultProps = {
  isOpponent: false,
};
