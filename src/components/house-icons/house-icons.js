import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';

import styles from './styles.module.scss';

export default function HouseIcons({ className, houseImages, houses }) {
  return (
    <FlexContainer className={classNames(className, styles.container)}>
      {Object.keys(houses).map(house => {
        if (!houseImages[house]) {
          return null;
        }
        return (
          <img
            key={house}
            className={styles.img}
            alt={house}
            src={houseImages[house].link}
          />
        );
      })}
    </FlexContainer>
  );
}

HouseIcons.propTypes = {
  className: PropTypes.string,
  houseImages: PropTypes.shape().isRequired,
  houses: PropTypes.shape().isRequired,
};

HouseIcons.defaultProps = {
  className: undefined,
};
