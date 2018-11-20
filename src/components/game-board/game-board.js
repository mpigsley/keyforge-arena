import React, { useRef } from 'react';

import styles from './styles.module.scss';

export default function GameBoard() {
  const canvasRef = useRef(null);

  return (
    <canvas
      className={styles.canvas}
      height={window.innerHeight}
      width={window.innerWidth}
      ref={canvasRef}
    />
  );
}
