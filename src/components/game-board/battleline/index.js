import React from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';

import { useDimensions } from 'utils/effects';
import { CardsType } from 'constants/types';
import styles from './styles.module.scss';

const CARD_PADDING = 10;
const HORIZONTAL_PADDING = 20;
const VERTICAL_PADDING = 8;
const CARD_RATIO = 300 / 420;
const ZOOMED_WIDTH = 250;

export default function Battleline({ cards, isOpponent }) {
  const { height, width } = useDimensions();
  const battlelineHeight = height / 4 - VERTICAL_PADDING * 2;
  const paddingWidth = (cards.length - 1) * CARD_PADDING;
  const innerWidth = width - HORIZONTAL_PADDING * 2 - paddingWidth;

  const defaultWidth = innerWidth / cards.length;
  const scaledWidth = Math.min(
    battlelineHeight * CARD_RATIO,
    defaultWidth,
    150,
  );
  const zoomScale = ZOOMED_WIDTH / scaledWidth;
  const cardsWidth = cards.length * scaledWidth + paddingWidth;
  const scaleOverhang = (ZOOMED_WIDTH - scaledWidth) / 2;
  const extraSideWidth = (width - cardsWidth) / 2;
  const needTranslate = scaleOverhang > extraSideWidth;

  return (
    <FlexContainer
      direction="column"
      className={styles.battleline}
      justify={isOpponent ? 'flexEnd' : 'flexStart'}
      style={{ padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px` }}
    >
      <FlexContainer justify="center">
        {cards.map(({ image, house, card }, i) => (
          <div
            key={`${card}-${i}` /* eslint-disable-line */}
            className={styles.imgContainer}
            style={{
              width: `${scaledWidth}px`,
              padding: `0px ${CARD_PADDING / 2}px`,
            }}
          >
            <img
              src={image.link}
              alt={`${house}-${card}`}
              className={styles.card}
              onMouseEnter={e => {
                const offset = (ZOOMED_WIDTH - scaledWidth) / (zoomScale * 2);
                if (i === 0 && needTranslate) {
                  e.target.style.transform = `scale(${zoomScale}) translate(${offset}px)`;
                } else if (i === cards.length - 1 && needTranslate) {
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
};

Battleline.defaultProps = {
  isOpponent: false,
};
