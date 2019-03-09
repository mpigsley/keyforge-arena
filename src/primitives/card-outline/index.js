import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';

import styles from './styles.module.scss';

export default function CardOutline({
  className,
  width,
  height,
  isActive,
  title,
  style,
  ...props
}) {
  return (
    <FlexContainer
      {...props}
      align="center"
      justify="center"
      direction="column"
      style={{
        ...style,
        width: `${width - 3}px`,
        height: `${height - 3}px`,
      }}
      className={classNames(className, styles.container, {
        [styles['container--active']]: isActive,
      })}
    >
      <span className={styles.title}>{title}</span>
    </FlexContainer>
  );
}

CardOutline.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string,
  isActive: PropTypes.bool,
  style: PropTypes.shape(),
};

CardOutline.defaultProps = {
  className: undefined,
  isActive: false,
  style: {},
};
