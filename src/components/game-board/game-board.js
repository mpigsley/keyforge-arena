import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { getUniqueCards } from 'utils/deck';
import { usePrevious, useDimensions, useAnimation } from 'utils/effects';
import { getPixelRatio } from 'utils/canvas';

import styles from './styles.module.scss';

// const IMG_HEIGHT = 150;
// const IMG_RATIO = 300 / 420;

export default function GameBoard({ isInitialized, decks, fetchCardImages }) {
  const previousIsInitialized = usePrevious(isInitialized);
  useEffect(
    () => {
      if (isInitialized && !previousIsInitialized) {
        const selectedDecks = [
          decks['5vAOh1H4Iwl4i6VUuhmH'],
          decks['7SlhTS8C7ZRIpJVkSfBg'],
        ];
        selectedDecks.forEach(({ expansion, ...selected }) =>
          fetchCardImages(expansion, getUniqueCards(selected)),
        );
      }
    },
    [isInitialized],
  );

  let ctx;
  const canvasEl = useRef(null);
  const ratio = useMemo(getPixelRatio, []);
  const { width, height } = useDimensions();
  useAnimation(
    useCallback(
      () => {
        ctx = ctx || canvasEl.current.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, width * ratio, height * ratio);
      },
      [height, width],
    ),
  );

  return (
    <canvas
      ref={canvasEl}
      id="game-board"
      width={width * ratio}
      height={height * ratio}
      style={{ width, height }}
      className={styles.canvas}
    />
  );
}

GameBoard.propTypes = {
  isInitialized: PropTypes.bool.isRequired,
  decks: PropTypes.shape().isRequired,
  fetchCardImages: PropTypes.func.isRequired,
};
