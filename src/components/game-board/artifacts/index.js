import React from 'react';
import PropTypes from 'prop-types';

// import { CardsType } from 'constants/types';

const HORIZONTAL_PADDING = 20;
const VERTICAL_PADDING = 8;

export default function Artifacts({ className }) {
  return (
    <div
      className={className}
      style={{ padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px` }}
    />
  );
}

Artifacts.propTypes = {
  className: PropTypes.string.isRequired,
  // artifacts: CardsType.isRequired,
};
