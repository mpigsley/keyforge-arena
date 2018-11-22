/* eslint-disable react/no-array-index-key */

import React from 'react';
import ReactHintFactory from 'react-hint';
import PropTypes from 'prop-types';

const ReactHint = ReactHintFactory(React);

export default function CardTooltip({ cardImages }) {
  const renderCardImage = target => {
    const { card } = target.dataset;
    return (
      <div className="react-hint__content">
        <img src={cardImages[card]} width={250} height={350} alt={card} />
      </div>
    );
  };

  return (
    <ReactHint
      attribute="data-card"
      onRenderContent={renderCardImage}
      events={{ hover: true }}
      position="left"
      autoPosition
    />
  );
}

CardTooltip.propTypes = {
  cardImages: PropTypes.shape(),
};

CardTooltip.defaultProps = {
  cardImages: {},
};
