import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { CARD_RATIO } from 'constants/game-board';

import CardBackImg from 'images/card-back.png';

import styles from './styles.module.scss';

export default function CardBack({
  className,
  style,
  width,
  isFlipped,
  ...props
}) {
  return (
    <img
      {...props}
      alt="Card back"
      src={CardBackImg}
      style={{ ...style, width, height: width / CARD_RATIO }}
      className={classNames(className, {
        [styles.flipped]: isFlipped,
      })}
    />
  );
}

CardBack.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape(),
  width: PropTypes.number.isRequired,
  isFlipped: PropTypes.bool,
};

CardBack.defaultProps = {
  className: undefined,
  style: {},
  isFlipped: false,
};
