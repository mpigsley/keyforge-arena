import React from 'react';

import styles from './styles.module.scss';

const IMG_HEIGHT = 150;
const IMG_RATIO = 300 / 420;

export default function GameBoard() {
  return (
    <svg
      className={styles.canvas}
      height={window.innerHeight}
      width={window.innerWidth}
    >
      <image
        xlinkHref="https://firebasestorage.googleapis.com/v0/b/keyforge-arena.appspot.com/o/cota%2F004.png?alt=media&token=c04e6f79-0683-4d64-8ab2-49ae879b1706"
        height={IMG_HEIGHT}
        width={IMG_HEIGHT * IMG_RATIO}
      />
    </svg>
  );
}
