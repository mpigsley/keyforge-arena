import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.module.scss';

export default function Input({ className, width, error, type, ...rest }) {
  let style = {};
  if (width) style = { width };

  if (type === 'textarea') {
    return (
      <textarea
        {...rest}
        style={style}
        className={classNames(styles.textarea, className, {
          [styles['input--error']]: error,
        })}
      />
    );
  }
  return (
    <input
      {...rest}
      type={type}
      className={classNames(styles.input, className, {
        [styles['input--error']]: error,
      })}
      style={style}
    />
  );
}

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  error: PropTypes.bool,
};

Input.defaultProps = {
  className: null,
  type: 'text',
  width: null,
  error: false,
};
