import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';
import CardOutline from 'primitives/card-outline';
import Card from 'components/card';

import {
  CARD_RATIO,
  ZOOMED_WIDTH,
  VERTICAL_PADDING,
  HORIZONTAL_PADDING,
  MAX_MINOR_CARD_WIDTH,
  ACTION_BUTTON_ROW_HEIGHT,
} from 'constants/game-board';
import { CardsType } from 'constants/types';
import { useDimensions } from 'utils/effects';

import styles from './styles.module.scss';

export default function Artifacts({
  className,
  artifacts,
  isOpponent,
  playerHouse,
  isDraggedArtifact,
  playArtifact,
}) {
  const [isAcceptingCard, setIsAcceptingCard] = useState(false);
  const { height, width } = useDimensions();

  const innerHeight =
    (isOpponent ? height * 0.2 : height * 0.3 - ACTION_BUTTON_ROW_HEIGHT) -
    VERTICAL_PADDING * 2;
  const innerWidth = width * (2 / 7) - HORIZONTAL_PADDING * 2;

  const cardWidth = Math.min(
    (innerWidth - (artifacts.length - 1) * VERTICAL_PADDING) / artifacts.length,
    MAX_MINOR_CARD_WIDTH,
  );
  const cardHeight = Math.min(cardWidth / CARD_RATIO, innerHeight);
  const modifiedCardWidth = cardHeight * CARD_RATIO;

  const zoomScale = ZOOMED_WIDTH / modifiedCardWidth;
  const zoomHeight = ZOOMED_WIDTH / CARD_RATIO;
  const bottomOverhang = (zoomHeight - cardHeight) / 2;

  return (
    <FlexContainer
      className={className}
      align={isOpponent ? 'flexStart' : 'flexEnd'}
      justify="flexEnd"
      style={{ padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px` }}
    >
      {isDraggedArtifact && !isOpponent && (
        <CardOutline
          isActive={isAcceptingCard}
          width={modifiedCardWidth}
          height={cardHeight}
          title="Play Artifact"
          onDragEnter={() => setIsAcceptingCard(true)}
          onDragLeave={() => setIsAcceptingCard(false)}
          onDragOver={e => {
            if (isDraggedArtifact) {
              e.preventDefault();
            }
          }}
          onDrop={e => {
            if (isDraggedArtifact) {
              e.preventDefault();
              playArtifact(e.dataTransfer.getData('card'));
              setIsAcceptingCard(false);
            }
          }}
        />
      )}
      {artifacts.map(({ key, expansion, card, house, isExhausted }, i) => (
        <div
          key={key}
          className={styles.imgContainer}
          style={{
            height: cardHeight,
            width: isExhausted ? cardHeight : modifiedCardWidth,
            paddingLeft: i !== 0 ? `${VERTICAL_PADDING / 2}px` : 0,
            paddingRight:
              i !== artifacts.length - 1 && !isAcceptingCard
                ? `${VERTICAL_PADDING / 2}px`
                : 0,
          }}
        >
          <Card
            className={styles.artifact}
            isActive={!isOpponent && !isExhausted && house === playerHouse}
            isExhausted={isExhausted}
            expansion={expansion}
            card={card}
            style={{ height: cardHeight, width: modifiedCardWidth }}
            onContextMenu={e => {
              e.preventDefault();
              const thisCardWidth = isExhausted
                ? cardHeight
                : modifiedCardWidth;
              const rightOverhang = Math.max(
                0,
                (ZOOMED_WIDTH - thisCardWidth) / 2,
              );
              const bottomOffset = bottomOverhang / zoomScale;
              const rightOffset = rightOverhang / zoomScale;
              const verticalDirection = isOpponent ? '' : '-';
              const scale = `scale(${zoomScale})`;
              const transform = `translate(-${rightOffset}px, ${verticalDirection}${bottomOffset}px)`;
              e.target.style.transform = `${scale} ${transform}`;
            }}
            onMouseLeave={e => {
              e.target.style.transform = '';
            }}
          />
        </div>
      ))}
    </FlexContainer>
  );
}

Artifacts.propTypes = {
  className: PropTypes.string.isRequired,
  artifacts: CardsType.isRequired,
  isOpponent: PropTypes.bool,
  playerHouse: PropTypes.string.isRequired,
  isDraggedArtifact: PropTypes.bool.isRequired,
  playArtifact: PropTypes.func.isRequired,
};

Artifacts.defaultProps = {
  isOpponent: false,
};
