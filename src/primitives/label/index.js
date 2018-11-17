import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.module.scss';

export default function Label(props) {
  const { htmlFor, className, noPadding, ...rest } = props;
  return (
    <label
      {...rest}
      htmlFor={htmlFor}
      className={classNames(styles.label, className, {
        [styles['label--noPadding']]: noPadding,
      })}
    />
  );
}

Label.propTypes = {
  className: PropTypes.string,
  noPadding: PropTypes.bool,
  htmlFor: PropTypes.string,
};

Label.defaultProps = {
  className: null,
  noPadding: false,
  htmlFor: 'input',
};
