import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';

import Spinner from 'primitives/spinner';

import styles from './styles.module.scss';

export default function Button({
  children,
  className,
  minimal,
  to,
  isLoading,
  ...rest
}) {
  const linkClass = classNames(styles.button, className, {
    [styles.button]: !minimal,
    [styles.minimal]: minimal,
  });
  let loadingSpinner = null;
  if (isLoading) {
    loadingSpinner = <Spinner size={20} className={styles.spinner} />;
  }

  const innerContent = (
    <>
      {loadingSpinner}
      <span
        className={classNames(styles.inner, { [styles.loading]: isLoading })}
      >
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <RouterLink {...rest} to={to} className={linkClass}>
        {innerContent}
      </RouterLink>
    );
  }
  return (
    <button {...rest} type="button" className={linkClass}>
      {innerContent}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  minimal: PropTypes.bool,
  isLoading: PropTypes.bool,
};

Button.defaultProps = {
  to: null,
  className: null,
  minimal: false,
  isLoading: false,
};
