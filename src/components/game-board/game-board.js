import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import OpponentHand from 'components/game-board/opponent-hand';
import Battleline from 'components/game-board/battleline';
import FlexContainer from 'primitives/flex-container';
import Hand from 'components/game-board/hand';
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
  const theirCards = take(opponentDeck.cards, 3);

  const userDeck = find(deckDetails, { isCurrentUser: true });
  const myCards = take(userDeck.cards, 6);

  return (
    <div className={classNames(styles.container, styles.gameBoard)}>
      <div className={styles.opponentSide}>
        <div className={styles.leftSide} />
        <OpponentHand handSize={4} />
        <div />
        <div className={styles.rightSide} />
      </div>
      <Battleline cards={theirCards} isOpponent />
      <Battleline cards={myCards} />
      <div className={styles.side}>
        <div className={styles.leftSide} />
        <div />
        <Hand cards={myCards} />
        <div className={styles.rightSide} />
      </div>
    </div>
  );
}

GameBoard.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  deckDetails: PropTypes.shape().isRequired,
};
