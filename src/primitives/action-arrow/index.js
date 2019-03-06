import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useCursorPosition } from 'utils/effects';

import styles from './styles.module.scss';

export default function ActionArrow({ isActive }) {
  const [position, setPosition] = useState([]);
  useCursorPosition((x, y) => setPosition([x, y]));
  const [x, y] = position;
  return (
    <svg
      className={classNames(styles.svg, { [styles['svg--active']]: isActive })}
    >
      <path d={`M0 0 L ${x} ${y}`} />
    </svg>
  );
}

ActionArrow.propTypes = {
  isActive: PropTypes.bool.isRequired,
};
