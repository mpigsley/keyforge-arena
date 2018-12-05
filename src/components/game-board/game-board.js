import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { useDimensions, useAnimation } from 'utils/effects';
import { getPixelRatio } from 'utils/canvas';
import gameLoop from 'utils/game';

import styles from './styles.module.scss';

export default function GameBoard({ hasLoaded, deckDetails }) {
  let ctx;
  const canvasEl = useRef(null);
  const ratio = useMemo(getPixelRatio, []);
  const { width, height } = useDimensions();
  useAnimation(() => {
    ctx = ctx || canvasEl.current.getContext('2d');
    gameLoop({ ctx, width, height, ratio }, { hasLoaded, deckDetails });
  });

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
  hasLoaded: PropTypes.bool.isRequired,
  deckDetails: PropTypes.shape().isRequired,
};
