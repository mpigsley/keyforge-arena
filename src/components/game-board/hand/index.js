import React, { useState } from 'react';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';

import { useDimensions } from 'utils/effects';
import { CardsType } from 'constants/types';
import styles from './styles.module.scss';

const CARD_RATIO = 300 / 420;
const CARD_WIDTH = 130;
const ZOOMED_WIDTH = 250;
const EXTRA_PADDING = 10;
const DEFAULT_OVERLAP = CARD_WIDTH * 0.6;

export default function Hand({ cards }) {
  const [hovered, setHovered] = useState();
  const { width, height } = useDimensions();
  const handWidth = width / 2;
  const handHeight = height * 0.18;
  const containerWidth = Math.min(
    handWidth,
    Math.max(0, (cards.length - 1) * DEFAULT_OVERLAP + CARD_WIDTH),
  );
  const zoomScale = ZOOMED_WIDTH / CARD_WIDTH;
  const overlap =
    containerWidth === handWidth
      ? (handWidth - CARD_WIDTH) / (cards.length - 1)
      : DEFAULT_OVERLAP;

  const scaleDiff = (ZOOMED_WIDTH - CARD_WIDTH) / (CARD_RATIO * 2);
  const offset =
    CARD_WIDTH / CARD_RATIO + scaleDiff + EXTRA_PADDING - handHeight;

  return (
    <FlexContainer justify="center">
      <div
        className={styles.relativeContainer}
        style={{ width: containerWidth }}
        onMouseLeave={() => setHovered()}
        onMouseMove={e => {
          const hoverIndex = Math.min(
            Math.floor(e.nativeEvent.offsetX / overlap),
            cards.length - 1,
          );
          if (hoverIndex !== hovered) {
            setHovered(hoverIndex);
          }
        }}
      >
        {cards.map(({ image, house, card }, i) => (
          <img
            key={`${card}-${i}` /* eslint-disable-line */}
            src={image.link}
            alt={`${house}-${card}`}
            className={classNames(styles.card, {
              [styles['card--hovered']]: i === hovered,
            })}
            style={{
              left: i * overlap,
              transform:
                i === hovered
                  ? `translateY(${-offset}px) scale(${zoomScale})`
                  : '',
            }}
          />
        ))}
      </div>
    </FlexContainer>
  );
}

Hand.propTypes = {
  cards: CardsType.isRequired,
};

Hand.defaultProps = {};
