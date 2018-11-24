import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.module.scss';

export default function Header({
  num,
  className,
  dark,
  noMargin,
  children,
  ...rest
}) {
  const Component = `h${num}`;
  return (
    <Component
      {...rest}
      className={classNames(
        styles.header,
        styles[`header--${num}`],
        className,
        { [styles['header--noMargin']]: noMargin },
      )}
    >
      {children}
    </Component>
  );
}

Header.propTypes = {
  num: PropTypes.oneOf(['1', '2', '3', '4', '5', '6']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  noMargin: PropTypes.bool,
};

Header.defaultProps = {
  num: '1',
  className: null,
  noMargin: false,
};
