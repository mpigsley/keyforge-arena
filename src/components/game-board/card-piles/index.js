import React from 'react';
import PropTypes from 'prop-types';

import { CardsType } from 'constants/types';
import { useDimensions } from 'utils/effects';

import styles from './styles.module.scss';

const HORIZONTAL_PADDING = 20;
const VERTICAL_PADDING = 8;

export default function CardPiles({
  className,
  numDraw,
  discarded,
  purged,
  archived,
}) {
  const { height, width } = useDimensions();
  const innerHeight = height * 0.3 - VERTICAL_PADDING * 2;
  const innerWidth = width * (2 / 7) - HORIZONTAL_PADDING * 2;
  return (
    <div
      className={className}
      style={{ padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px` }}
    />
  );
}

CardPiles.propTypes = {
  className: PropTypes.string,
  numDraw: PropTypes.number.isRequired,
  discarded: CardsType.isRequired,
  purged: CardsType.isRequired,
  archived: CardsType.isRequired,
};

CardPiles.defaultProps = {
  className: undefined,
};
