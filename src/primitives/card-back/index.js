import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';

import Logo from 'images/logo.png';
import styles from './styles.module.scss';

const CARD_RATIO = 300 / 420;

export default function CardBack({
  className,
  style,
  width,
  isFlipped,
  isOutlined,
  ...props
}) {
  const sideMargin = width / 15;
  return (
    <FlexContainer
      {...props}
      className={classNames(className, styles.card, {
        [styles['card--outlined']]: isOutlined,
      })}
      style={{ ...style, width, height: width / CARD_RATIO }}
    >
      <FlexContainer
        align="center"
        justify="center"
        className={styles.inner}
        style={{ margin: sideMargin, height: `calc(100% - ${2 * sideMargin})` }}
      >
        <img
          className={classNames(styles.logo, {
            [styles['logo--flipped']]: isFlipped,
          })}
          alt="logo"
          src={Logo}
        />
      </FlexContainer>
    </FlexContainer>
  );
}

CardBack.propTypes = {
  className: PropTypes.string,
  style: PropTypes.shape(),
  width: PropTypes.number.isRequired,
  isFlipped: PropTypes.bool,
  isOutlined: PropTypes.bool,
};

CardBack.defaultProps = {
  className: undefined,
  style: {},
  isFlipped: false,
  isOutlined: false,
};
