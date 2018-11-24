import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.module.scss';

export default function Spinner({ className, size, light }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={classNames(styles.spinner, className, {
        [styles.light]: light,
      })}
    >
      <div className={classNames(styles.circle1, styles.child)} />
      <div className={classNames(styles.circle2, styles.child)} />
      <div className={classNames(styles.circle3, styles.child)} />
      <div className={classNames(styles.circle4, styles.child)} />
      <div className={classNames(styles.circle5, styles.child)} />
      <div className={classNames(styles.circle6, styles.child)} />
      <div className={classNames(styles.circle7, styles.child)} />
      <div className={classNames(styles.circle8, styles.child)} />
      <div className={classNames(styles.circle9, styles.child)} />
      <div className={classNames(styles.circle10, styles.child)} />
      <div className={classNames(styles.circle11, styles.child)} />
      <div className={classNames(styles.circle12, styles.child)} />
    </div>
  );
}

Spinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  light: PropTypes.bool,
};

Spinner.defaultProps = {
  className: null,
  size: 30,
  light: false,
};
