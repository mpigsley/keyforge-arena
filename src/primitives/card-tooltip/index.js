import React from 'react';
import ReactHintFactory from 'react-hint';

import Card from 'components/card';

const ReactHint = ReactHintFactory(React);

export default function CardTooltip() {
  const renderCardImage = target => {
    const [expansion, card] = target.dataset.card.split('-');
    return (
      <div className="react-hint__content">
        <Card expansion={expansion} card={card} width={250} height={350} />
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
