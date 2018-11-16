import React from 'react';

import FlexContainer from 'primitives/flex-container';
import Button from 'primitives/button';

import styles from './styles.module.scss';

export default function Home() {
  return (
    <FlexContainer className={styles.home} align="center" justify="center">
      <Button to="/my-decks">My Decks</Button>
      <Button to="/game">Play Now</Button>
    </FlexContainer>
  );
}
