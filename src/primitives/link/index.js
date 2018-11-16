import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';

import styles from './styles.module.scss';

export default function ButtonLink(props) {
  const { className, minimal, to, ...rest } = props;
  return (
    <RouterLink
      {...rest}
      to={to}
      className={classNames(className, {
        [styles.button]: !minimal,
        [styles['button--minimal']]: minimal,
      })}
    />
  );
}

ButtonLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
  minimal: PropTypes.bool,
};

ButtonLink.defaultProps = {
  className: null,
  minimal: false,
};
