import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import GAME_SEQUENCE from 'constants/game-sequence.json';
import HOUSES from 'constants/houses.json';
import { useTimer } from 'utils/effects';

import UnforgedBlue from 'images/unforged-blue.png';
import UnforgedRed from 'images/unforged-red.png';
import UnforgedYellow from 'images/unforged-yellow.png';
import ForgedBlue from 'images/forged-blue.png';
import ForgedRed from 'images/forged-red.png';
import ForgedYellow from 'images/forged-yellow.png';
import { ReactComponent as ForgeKey } from 'images/forge-key.svg';
import { ReactComponent as ChooseHouse } from 'images/choose-house.svg';
import { ReactComponent as PlayCards } from 'images/play-cards.svg';
import { ReactComponent as Ready } from 'images/ready.svg';
import { ReactComponent as DrawCards } from 'images/draw-cards.svg';

import styles from './styles.module.scss';

export default function GameState({
  numKeys,
  numAember,
  keyCost,
  turn,
  house,
  houses,
  houseImages,
  gameStart,
  isOpponent,
  turnSequence,
  chooseHouse,
}) {
  const [time, setTime] = useState('00:00');
  useTimer(gameStart, setTime, !isOpponent);

  let leftSide;
  if (isOpponent) {
    leftSide = (
      <div className={styles.left}>
        Turn {turn} | {time}
      </div>
    );
  } else {
    leftSide = (
      <FlexContainer
        flex="1"
        direction="column"
        align="center"
        className={styles.left}
      >
        <div>
          <ForgeKey
            className={classNames(styles.turnIcon, {
              [styles['turnIcon--active']]:
                turnSequence === GAME_SEQUENCE.FORGE.key,
            })}
          />
          <ChooseHouse
            className={classNames(styles.turnIcon, {
              [styles['turnIcon--active']]:
                turnSequence === GAME_SEQUENCE.HOUSE.key,
            })}
          />
          <PlayCards
            className={classNames(styles.turnIcon, {
              [styles['turnIcon--active']]:
                turnSequence === GAME_SEQUENCE.MAIN.key,
            })}
          />
          <Ready
            className={classNames(styles.turnIcon, {
              [styles['turnIcon--active']]:
                turnSequence === GAME_SEQUENCE.READY.key,
            })}
          />
          <DrawCards
            className={classNames(styles.turnIcon, {
              [styles['turnIcon--active']]:
                turnSequence === GAME_SEQUENCE.DRAW.key,
            })}
          />
        </div>
        <span className={styles.turnText}>
          {GAME_SEQUENCE[turnSequence].name}
        </span>
      </FlexContainer>
    );
  }

  let center;
  if (!isOpponent && turnSequence === GAME_SEQUENCE.HOUSE.key) {
    center = (
      <FlexContainer align="center" className={styles.secondRow}>
        <div>
          {houses.map(houseKey => (
            <img
              key={houseKey}
              src={houseImages[houseKey].link}
              onClick={() => chooseHouse(houseKey)}
              className={styles.house}
              alt={houseKey}
            />
          ))}
        </div>
      </FlexContainer>
    );
  } else {
    center = (
      <div>
        <img
          src={numKeys > 0 ? ForgedBlue : UnforgedBlue}
          className={styles.key}
          alt="Blue Key"
        />
        <img
          src={numKeys > 1 ? ForgedYellow : UnforgedYellow}
          className={styles.key}
          alt="Yellow Key"
        />
        <img
          src={numKeys > 2 ? ForgedRed : UnforgedRed}
          className={styles.key}
          alt="Yellow Key"
        />
      </div>
    );
  }

  return (
    <FlexContainer direction="column" justify="center">
      <FlexContainer align="center">
        {leftSide}
        {center}
        <FlexContainer
          flex="1"
          direction="column"
          align="center"
          justify="center"
          className={styles.right}
        >
          <span
            className={classNames(styles.aember, {
              [styles['aember--check']]: numAember > keyCost,
            })}
          >
            {numAember} / {keyCost} Æmber
          </span>
          {!!house && (
            <span className={styles.chosenHouse}>
              House:
              <span className={styles.houseName}>{HOUSES[house].name}</span>
            </span>
          )}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
}

GameState.propTypes = {
  numKeys: PropTypes.number.isRequired,
  numAember: PropTypes.number.isRequired,
  keyCost: PropTypes.number.isRequired,
  turn: PropTypes.number,
  house: PropTypes.string.isRequired,
  houses: PropTypes.arrayOf(PropTypes.string).isRequired,
  houseImages: PropTypes.shape().isRequired,
  gameStart: PropTypes.instanceOf(Date),
  isOpponent: PropTypes.bool,
  turnSequence: PropTypes.string.isRequired,
  chooseHouse: PropTypes.func.isRequired,
};

GameState.defaultProps = {
  turn: undefined,
  gameStart: undefined,
  isOpponent: false,
};
