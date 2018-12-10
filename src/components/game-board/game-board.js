import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Battleline from 'components/game-board/battleline';
import FlexContainer from 'primitives/flex-container';
import Spinner from 'primitives/spinner';
import Header from 'primitives/header';

import { find, take } from 'constants/lodash';
import styles from './styles.module.scss';

export default function GameBoard({ hasLoaded, deckDetails }) {
  if (!hasLoaded) {
    return (
      <FlexContainer
        align="center"
        justify="center"
        direction="column"
        className={styles.container}
      >
        <Header>Loading Game</Header>
        <Spinner />
      </FlexContainer>
    );
  }

  const opponentDeck = find(deckDetails, { isCurrentUser: false });
  const theirCards = take(opponentDeck.cards, 10);

  const userDeck = find(deckDetails, { isCurrentUser: true });
  const myCards = take(userDeck.cards, 6);

  return (
    <div className={classNames(styles.container, styles.gameBoard)}>
      <div />
      <FlexContainer
        direction="column"
        justify="flexEnd"
        className={styles.side}
      >
        <Battleline cards={theirCards} />
      </FlexContainer>
      <FlexContainer
        direction="column"
        justify="flexStart"
        className={styles.side}
      >
        <Battleline cards={myCards} />
      </FlexContainer>
      <div />
    </div>
  );
}

GameBoard.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  deckDetails: PropTypes.shape().isRequired,
};
