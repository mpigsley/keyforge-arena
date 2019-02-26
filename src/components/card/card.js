import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
      {...props}
    />
  );
}

Card.propTypes = {
  className: PropTypes.string.isRequired,
  active: PropTypes.bool,
  cardImages: PropTypes.arrayOf(
    PropTypes.shape({ link: PropTypes.string.isRequired }),
  ).isRequired,
  expansion: PropTypes.string.isRequired,
  card: PropTypes.string.isRequired,
};

Card.defaultProps = {
  active: false,
};
