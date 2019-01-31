import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import OpponentHand from 'components/game-board/opponent-hand';
import Battleline from 'components/game-board/battleline';
import CardPiles from 'components/game-board/card-piles';
import Artifacts from 'components/game-board/artifacts';
import Hand from 'components/game-board/hand';
import FlexContainer from 'primitives/flex-container';
import Spinner from 'primitives/spinner';
import Header from 'primitives/header';

import { useDimensionConstraints } from 'utils/effects';
import { find, take, slice } from 'constants/lodash';
import styles from './styles.module.scss';

export default function GameBoard({ hasLoaded, deckDetails }) {
  const isConstrained = useDimensionConstraints(650, 550);
  if (!hasLoaded || isConstrained) {
    let content = <Header>Increase Window Size</Header>;
    if (!hasLoaded) {
      content = (
        <>
          <Header>Loading Game</Header>
          <Spinner />
        </>
      );
    }
    return (
      <FlexContainer
        align="center"
        justify="center"
        direction="column"
        className={styles.container}
      >
        {content}
      </FlexContainer>
    );
  }

  const opponentDeck = find(deckDetails, { isCurrentUser: false });
  const theirCards = take(opponentDeck.cards, 3);
  const theirDiscard = slice(opponentDeck.cards, 3, 10);
  const theirArchived = [];
  const theirPurged = slice(opponentDeck.cards, 10, 11);
  const theirArtifacts = slice(opponentDeck.cards, 11, 14);

  const userDeck = find(deckDetails, { isCurrentUser: true });
  const myCards = take(userDeck.cards, 6);
  const myDiscard = slice(userDeck.cards, 6, 10);
  const myArchived = slice(userDeck.cards, 10, 12);
  const myPurged = [];
  const myArtifacts = slice(userDeck.cards, 12, 13);

  return (
    <div className={classNames(styles.container, styles.gameBoard)}>
      <div className={styles.opponentSide}>
        <CardPiles
          isOpponent
          className={styles.leftSide}
          numDraw={opponentDeck.cards.length - 14}
          discarded={theirDiscard}
          archived={theirArchived}
          purged={theirPurged}
        />
        <OpponentHand handSize={4} />
        <div />
        <Artifacts
          className={styles.rightSide}
          artifacts={theirArtifacts}
          isOpponent
        />
      </div>
      <Battleline cards={theirCards} isOpponent />
      <Battleline cards={myCards} />
      <div className={styles.side}>
        <CardPiles
          className={styles.leftSide}
          numDraw={userDeck.cards.length - 11}
          discarded={myDiscard}
          archived={myArchived}
          purged={myPurged}
        />
        <div />
        <Hand cards={myCards} />
        <Artifacts className={styles.rightSide} artifacts={myArtifacts} />
      </div>
    </div>
  );
}

GameBoard.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  deckDetails: PropTypes.shape().isRequired,
};
