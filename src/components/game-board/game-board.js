import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import OpponentHand from 'components/game-board/opponent-hand';
import Battleline from 'components/game-board/battleline';
import CardPiles from 'components/game-board/card-piles';
import CardModal from 'components/game-board/card-modal';
import Artifacts from 'components/game-board/artifacts';
import Hand from 'components/game-board/hand';
import GameState from 'components/game-board/game-state';
import FlexContainer from 'primitives/flex-container';
import Spinner from 'primitives/spinner';
import Button from 'primitives/button';
import Header from 'primitives/header';

import { useDimensionConstraints } from 'utils/effects';
import { UserGameState } from 'constants/types';
import { find } from 'constants/lodash';
import { VERTICAL_PADDING, HORIZONTAL_PADDING } from 'constants/game-board';
import GAME_SEQUENCE from 'constants/game-sequence.json';

import styles from './styles.module.scss';

export default function GameBoard({
  isInitialized,
  gameStart,
  gameState,
  turnSequence,
  endTurn,
}) {
  const isConstrained = useDimensionConstraints(650, 550);
  const playerState = find(gameState.state, { isOpponent: false }) || {};
  const opponentState = find(gameState.state, { isOpponent: true }) || {};

  if (!isInitialized || isConstrained) {
    let content = (
      <Header className={styles.header}>Increase Window Size</Header>
    );
    if (!isInitialized) {
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

  return (
    <>
      <div className={classNames(styles.container, styles.gameBoard)}>
        <div className={styles.opponentSide}>
          <CardPiles
            isOpponent
            className={styles.leftSide}
            numDraw={opponentState.deckSize}
            numArchived={opponentState.archiveSize}
            discarded={opponentState.discard}
            purged={opponentState.purged}
          />
          <OpponentHand handSize={opponentState.handSize} />
          <GameState
            numKeys={opponentState.keys}
            numAember={opponentState.aember}
            keyCost={opponentState.keyCost}
            house={opponentState.house}
            houses={opponentState.houses}
            turn={playerState.turn}
            gameStart={gameStart}
            isOpponent
          />
          <Artifacts
            className={styles.rightSide}
            artifacts={opponentState.artifacts}
            isOpponent
          />
        </div>
        <Battleline cards={opponentState.battlelines} isOpponent />
        <Battleline cards={playerState.battlelines} />
        <div className={styles.side}>
          <CardPiles
            className={styles.leftSide}
            numDraw={playerState.deckSize}
            discarded={playerState.discard}
            archived={playerState.archived}
            purged={playerState.purged}
          />
          <GameState
            numKeys={playerState.keys}
            numAember={playerState.aember}
            keyCost={playerState.keyCost}
            house={playerState.house}
            houses={playerState.houses}
          />
          <Hand className={styles.hand} cards={playerState.hand} />
          <Artifacts
            className={styles.rightSide}
            artifacts={playerState.artifacts}
          />
          <FlexContainer
            justify="flexEnd"
            style={{ padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px` }}
          >
            <Button
              primary
              disabled={turnSequence !== GAME_SEQUENCE.MAIN.key}
              onClick={endTurn}
              className={styles.actionBtn}
            >
              End Turn
            </Button>
          </FlexContainer>
        </div>
      </div>
      <CardModal />
    </>
  );
}

GameBoard.propTypes = {
  isInitialized: PropTypes.bool.isRequired,
  turnSequence: PropTypes.string,
  endTurn: PropTypes.func.isRequired,
  gameStart: PropTypes.instanceOf(Date),
  gameState: PropTypes.shape({
    state: PropTypes.arrayOf(UserGameState),
    turn: PropTypes.string,
  }),
};

GameBoard.defaultProps = {
  turnSequence: GAME_SEQUENCE.OPPONENT.key,
  gameStart: undefined,
  gameState: {},
};
