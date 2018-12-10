import React from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';

import { useDimensions } from 'utils/effects';
import styles from './styles.module.scss';

const CARD_RATIO = 300 / 420;
const ZOOMED_WIDTH = 300;

export default function Battleline({ cards }) {
  const { height, width } = useDimensions();
  const battlelineHeight = height / 5;

  const defaultWidth = width / cards.length;
  const scaledWidth = Math.min(
    battlelineHeight * CARD_RATIO,
    defaultWidth,
    150,
  );
  const zoomScale = ZOOMED_WIDTH / scaledWidth;

  return (
    <FlexContainer justify="center" className={styles.container}>
      {cards.map(({ image, house, card }, i) => (
        <div
          key={`${card}-${i}` /* eslint-disable-line */}
          className={styles.imgContainer}
          style={{ width: `${scaledWidth}px` }}
        >
          <img
            src={image.link}
            alt={`${house}-${card}`}
            className={styles.card}
            onMouseEnter={e => {
              const offset = (ZOOMED_WIDTH - scaledWidth) / 4;
              if (i === 0) {
                e.target.style.transform = `scale(${zoomScale}) translate(${offset}px)`;
              } else if (i === cards.length - 1) {
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
  );
}

Battleline.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.shape({
        link: PropTypes.string.isRequired,
      }).isRequired,
      house: PropTypes.string.isRequired,
      card: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
