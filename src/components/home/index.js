import React from 'react';

import FlexContainer from 'primitives/flex-container';
import Link from 'primitives/link';

import styles from './styles.module.scss';

export default function Home() {
  return (
    <FlexContainer className={styles.home} align="center" justify="center">
      <Link to="/my-decks">My Decks</Link>
      <Link to="/game">Play Now</Link>
    </FlexContainer>
  );
}
