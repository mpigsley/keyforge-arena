import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.module.scss';

export default function FlexContainer({
  align,
  className,
  justify,
  direction,
  children,
  wrap,
  scroll,
  flex,
  shrink,
  style,
  ...rest
}) {
  const containerStyle = flex !== null ? { ...style, flex } : style;

  return (
    <div
      {...rest}
      style={containerStyle}
      className={classNames(styles.container, className, {
        [styles[`align--${align}`]]: align,
        [styles[`justify--${justify}`]]: justify,
        [styles[`direction--${direction}`]]: direction,
        [styles[`shrink--${shrink}`]]: shrink,
        [styles.wrap]: wrap,
        [styles.scroll]: scroll,
      })}
    >
      {children}
    </div>
  );
}

FlexContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf([
    'stretch',
    'center',
    'flexStart',
    'flexEnd',
    'baseline',
    'initial',
    'inherit',
  ]),
  justify: PropTypes.oneOf([
    'flexStart',
    'flexEnd',
    'center',
    'spaceBetween',
    'spaceAround',
    'spaceEvenly',
    'initial',
    'inherit',
  ]),
  direction: PropTypes.oneOf(['row', 'column', 'rowReverse', 'columnReverse']),
  wrap: PropTypes.bool,
  scroll: PropTypes.bool,
  flex: PropTypes.string,
  shrink: PropTypes.oneOf(['0', '1']),
  style: PropTypes.shape(),
};

FlexContainer.defaultProps = {
  className: null,
  align: 'stretch',
  justify: null,
  direction: null,
  wrap: false,
  scroll: false,
  flex: null,
  shrink: null,
  style: {},
};
