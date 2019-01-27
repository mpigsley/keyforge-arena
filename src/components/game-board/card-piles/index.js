import React from 'react';
import PropTypes from 'prop-types';

import { CardsType } from 'constants/types';

import styles from './styles.module.scss';

export default function CardPiles({
  className,
  numDraw,
  discarded,
  purged,
  archived,
}) {
  return <div className={className} />;
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
