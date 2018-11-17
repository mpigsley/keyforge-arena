import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from 'primitives/button';

import styles from './styles.module.scss';

export default function IconButton({ className, ...rest }) {
  return (
    <Button className={classNames(className, styles.iconButton)} {...rest} />
  );
}

IconButton.propTypes = {
  className: PropTypes.string,
};

IconButton.defaultProps = {
  className: undefined,
};
