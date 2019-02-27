import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { omit } from 'constants/lodash';

import styles from './styles.module.scss';

export default function Card({
  className,
  active,
  cardImages,
  expansion,
  card,
  ...props
}) {
  const key = `${expansion}-${card}`;
  return (
    <img
      src={(cardImages[key] || {}).link}
      className={classNames(styles.card, className, {
        [styles['card--active']]: active,
      })}
      alt={key}
      {...omit(props, 'dispatch')}
    />
  );
}

Card.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  cardImages: PropTypes.shape().isRequired,
  expansion: PropTypes.string.isRequired,
  card: PropTypes.string.isRequired,
};

Card.defaultProps = {
  className: undefined,
  active: false,
};
