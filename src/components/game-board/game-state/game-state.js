import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
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
  houses,
  houseImages,
  gameStart,
  isOpponent,
  isChoosingHouse,
  turnSequenceText,
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
      <FlexContainer flex="1" direction="column" align="center">
        <div>
          <ForgeKey className={classNames(styles.turnIcon)} />
          <ChooseHouse className={classNames(styles.turnIcon)} />
          <PlayCards className={classNames(styles.turnIcon)} />
          <Ready className={classNames(styles.turnIcon)} />
          <DrawCards className={classNames(styles.turnIcon)} />
        </div>
        <span className={styles.turnText}>{turnSequenceText}</span>
      </FlexContainer>
    );
  }

  let center;
  if (!isOpponent && isChoosingHouse) {
    center = (
      <FlexContainer align="center" className={styles.secondRow}>
        <div>
          {houses.map(house => (
            <img
              key={house}
              src={houseImages[house].link}
              className={styles.house}
              alt={house}
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
        <div
          className={classNames(styles.aember, {
            [styles.check]: numAember > keyCost,
          })}
        >
          {numAember} / {keyCost} Æmber
        </div>
      </FlexContainer>
    </FlexContainer>
  );
}

GameState.propTypes = {
  numKeys: PropTypes.number.isRequired,
  numAember: PropTypes.number.isRequired,
  keyCost: PropTypes.number.isRequired,
  turn: PropTypes.number,
  houses: PropTypes.arrayOf(PropTypes.string).isRequired,
  houseImages: PropTypes.shape().isRequired,
  gameStart: PropTypes.instanceOf(Date),
  isOpponent: PropTypes.bool,
  isChoosingHouse: PropTypes.bool,
  turnSequenceText: PropTypes.string.isRequired,
};

GameState.defaultProps = {
  turn: undefined,
  gameStart: undefined,
  isOpponent: false,
  isChoosingHouse: false,
};
