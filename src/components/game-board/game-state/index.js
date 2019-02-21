import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import { useTimer, useDimensions } from 'utils/effects';
import { VERTICAL_PADDING } from 'constants/game-board';

import UnforgedBlue from 'images/unforged-blue.png';
import UnforgedRed from 'images/unforged-red.png';
import UnforgedYellow from 'images/unforged-yellow.png';
import ForgedBlue from 'images/forged-blue.png';
import ForgedRed from 'images/forged-red.png';
import ForgedYellow from 'images/forged-yellow.png';

import styles from './styles.module.scss';

const MAX_KEY_SIZE = 50;

export default function GameState({
  numKeys,
  numAember,
  keyCost,
  turn,
  gameStart,
  isOpponent,
}) {
  const { height } = useDimensions();
  const [time, setTime] = useState('00:00');
  useTimer(gameStart, setTime, isOpponent);

  const gameStateHeight = Math.min(
    MAX_KEY_SIZE,
    height * (isOpponent ? 2 / 15 : 0.12) - 2 * VERTICAL_PADDING,
  );

  return (
    <FlexContainer align="center">
      <div className={styles.turnTimer}>
        {!isOpponent && `Turn ${turn} | ${time}`}
      </div>
      <div>
        <img
          src={numKeys > 0 ? ForgedBlue : UnforgedBlue}
          style={{
            height: gameStateHeight,
            paddingRight: `${VERTICAL_PADDING}px`,
          }}
          alt="Blue Key"
        />
        <img
          src={numKeys > 1 ? ForgedYellow : UnforgedYellow}
          style={{
            height: gameStateHeight,
            paddingRight: `${VERTICAL_PADDING}px`,
          }}
          alt="Yellow Key"
        />
        <img
          src={numKeys > 2 ? ForgedRed : UnforgedRed}
          style={{ height: gameStateHeight }}
          alt="Yellow Key"
        />
      </div>
      <div
        className={classNames(styles.aember, {
          [styles.check]: numAember > keyCost,
        })}
      >
        {numAember} / {keyCost} Æmber
      </div>
    </FlexContainer>
  );
}

GameState.propTypes = {
  numKeys: PropTypes.number.isRequired,
  numAember: PropTypes.number.isRequired,
  keyCost: PropTypes.number.isRequired,
  turn: PropTypes.number,
  gameStart: PropTypes.instanceOf(Date),
  isOpponent: PropTypes.bool,
};

GameState.defaultProps = {
  turn: undefined,
  gameStart: undefined,
  isOpponent: false,
};
