import React from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';
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

export default function Artifacts({ className, artifacts, isOpponent }) {
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
  const rightOverhang = (ZOOMED_WIDTH - modifiedCardWidth) / 2;

  return (
    <FlexContainer
      className={className}
      align={isOpponent ? 'flexStart' : 'flexEnd'}
      justify="flexEnd"
      style={{ padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px` }}
    >
      {artifacts.map(({ expansion, card }, i) => (
        <Card
          key={`${card}-${i}` /* eslint-disable-line */}
          className={styles.artifact}
          expansion={expansion}
          card={card}
          style={{
            height: cardHeight,
            width: modifiedCardWidth,
            paddingLeft: i !== 0 ? `${VERTICAL_PADDING / 2}px` : 0,
            paddingRight:
              i !== artifacts.length - 1 ? `${VERTICAL_PADDING / 2}px` : 0,
          }}
          onContextMenu={e => {
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
