import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import OpponentHand from 'components/game-board/opponent-hand';
import Battleline from 'components/game-board/battleline';
import CardPiles from 'components/game-board/card-piles';
import Artifacts from 'components/game-board/artifacts';
import Hand from 'components/game-board/hand';
import GameState from 'components/game-board/game-state';
import FlexContainer from 'primitives/flex-container';
import Spinner from 'primitives/spinner';
import Header from 'primitives/header';

import { useDimensionConstraints } from 'utils/effects';
import { UserGameState } from 'constants/types';
import styles from './styles.module.scss';

export default function GameBoard({
  hasLoaded,
  gameStart,
  playerState,
  opponentState,
}) {
  const isConstrained = useDimensionConstraints(650, 550);
  if (!hasLoaded || isConstrained) {
    let content = (
      <Header className={styles.header}>Increase Window Size</Header>
    );
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

  return (
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
          turn={playerState.turn}
          gameStart={gameStart}
        />
        <Hand cards={playerState.hand} />
        <Artifacts
          className={styles.rightSide}
          artifacts={playerState.artifacts}
        />
      </div>
    </div>
  );
}

GameBoard.propTypes = {
  hasLoaded: PropTypes.bool.isRequired,
  gameStart: PropTypes.instanceOf(Date),
  playerState: UserGameState,
  opponentState: UserGameState,
};

GameBoard.defaultProps = {
  gameStart: undefined,
  playerState: undefined,
  opponentState: undefined,
};
