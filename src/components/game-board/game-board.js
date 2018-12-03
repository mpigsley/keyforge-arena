import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import { getUniqueCards } from 'utils/deck';
import { usePrevious, useResize } from 'utils/effects';
import { getPixelRatio } from 'utils/canvas';
import { debounce } from 'constants/lodash';

import styles from './styles.module.scss';

// const IMG_HEIGHT = 150;
// const IMG_RATIO = 300 / 420;

export default function GameBoard({ isInitialized, decks, fetchCardImages }) {
  const canvasEl = useRef(null);
  const previousIsInitialized = usePrevious(isInitialized);
  const [{ width, height }, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const ratio = useMemo(getPixelRatio, []);
  let ctx;
  const paint = useCallback(
    () => {
      if (!canvasEl.current) {
        return;
      }
      ctx = ctx || canvasEl.current.getContext('2d');
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, width * ratio, height * ratio);
    },
    [width, height, canvasEl.current],
  );

  useEffect(paint);

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

  useResize(
    debounce(
      () =>
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      100,
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
