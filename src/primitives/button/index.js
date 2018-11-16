import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';

import styles from './styles.module.scss';

export default function Button({ className, minimal, to, ...rest }) {
  const linkClass = classNames(className, {
    [styles.button]: !minimal,
    [styles['button--minimal']]: minimal,
  });
  if (to) {
    return <RouterLink {...rest} to={to} className={linkClass} />;
  }
  return <button {...rest} type="button" className={linkClass} />;
}

Button.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  minimal: PropTypes.bool,
};

Button.defaultProps = {
  to: null,
  className: null,
  minimal: false,
};
