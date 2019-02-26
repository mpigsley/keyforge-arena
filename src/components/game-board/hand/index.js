import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';

import {
  CARD_RATIO,
  ZOOMED_WIDTH,
  MAX_CARD_WIDTH,
  VERTICAL_PADDING,
  ACTION_BUTTON_ROW_HEIGHT,
} from 'constants/game-board';
import { useDimensions } from 'utils/effects';
import { CardsType } from 'constants/types';
import styles from './styles.module.scss';

const DEFAULT_OVERLAP = MAX_CARD_WIDTH * 0.6;

export default function Hand({ className, cards }) {
  const [hovered, setHovered] = useState();
  const { width, height } = useDimensions();

  const handWidth = width * (3 / 7);
  const handHeight = (height * (3 / 10) + ACTION_BUTTON_ROW_HEIGHT) / 2;
  const containerWidth = Math.min(
    handWidth,
    Math.max(0, (cards.length - 1) * DEFAULT_OVERLAP + MAX_CARD_WIDTH),
  );
  const zoomScale = ZOOMED_WIDTH / MAX_CARD_WIDTH;
  const overlap =
    containerWidth === handWidth
      ? (handWidth - MAX_CARD_WIDTH) / (cards.length - 1)
      : DEFAULT_OVERLAP;

  const scaleDiff = (ZOOMED_WIDTH - MAX_CARD_WIDTH) / (CARD_RATIO * 2);
  const offset =
    MAX_CARD_WIDTH / CARD_RATIO + scaleDiff + VERTICAL_PADDING / 2 - handHeight;

  return (
    <FlexContainer justify="center" className={className}>
      <div
        className={styles.relativeContainer}
        style={{ width: containerWidth }}
        onMouseMove={e => {
          const hoverIndex = Math.min(
            Math.floor((e.pageX - e.target.parentNode.offsetLeft) / overlap),
            cards.length - 1,
          );
          if (hoverIndex !== hovered) {
            setHovered(hoverIndex);
          }
          e.preventDefault();
        }}
      >
        {cards.map(({ image, expansion, house, card }, i) => (
          <img
            draggable
            key={`${card}-${i}` /* eslint-disable-line */}
            src={image.link}
            alt={`${house}-${card}`}
            className={classNames(styles.card, {
              [styles['card--hovered']]: i === hovered,
            })}
            onDragStart={e =>
              e.dataTransfer.setData(
                'card',
                `${expansion}-${house}-${card}-${i}`,
              )
            }
            onMouseLeave={() => setHovered()}
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
  className: PropTypes.string.isRequired,
  cards: CardsType.isRequired,
};

Hand.defaultProps = {};
