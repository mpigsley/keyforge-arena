import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import FlexContainer from 'primitives/flex-container';
import FullModal from 'primitives/full-modal';
import Spinner from 'primitives/spinner';
import Button from 'primitives/button';
import Card from 'components/card';

import { ZOOMED_WIDTH, CARD_RATIO } from 'constants/game-board';
import { CardsType } from 'constants/types';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function CardModal({
  cardModal,
  isHandlingAction,
  updateCardModal,
  handleGameAction,
}) {
  const { cards, isStack, actions, ...config } = cardModal;
  let actionElement;
  if ((actions || []).length) {
    if (isHandlingAction) {
      actionElement = (
        <FlexContainer justify="center">
          <Spinner size={36} className={styles.spinner} />
        </FlexContainer>
      );
    } else {
      actionElement = (
        <FlexContainer justify="center">
          {actions.map(({ action, ...buttonProps }) => (
            <Button {...buttonProps} onClick={() => handleGameAction(action)} />
          ))}
        </FlexContainer>
      );
    }
  }
  return (
    <FullModal
      isOpen={!!cards.length}
      onClose={() => updateCardModal()}
      {...config}
    >
      <FlexContainer
        direction="column"
        justify="center"
        className={styles.container}
      >
        <FlexContainer className={styles.cardContainer}>
          {cards.map(({ card, expansion }, i) => (
            <FlexContainer
              className={styles.card}
              direction="column"
              align={i === 0 ? 'flexStart' : 'flexEnd'}
              justify="flexEnd"
              key={`${card}-${i}` /* eslint-disable-line */}
            >
              {isStack && i === 0 && cards.length > 1 && (
                <span className={styles.directionText}>Top</span>
              )}
              {isStack && i === cards.length - 1 && cards.length > 1 && (
                <span className={styles.directionText}>Bottom</span>
              )}
              <Card
                expansion={expansion}
                card={card}
                style={{
                  width: ZOOMED_WIDTH,
                  height: ZOOMED_WIDTH / CARD_RATIO,
                }}
              />
            </FlexContainer>
          ))}
        </FlexContainer>
      </FlexContainer>
      {actionElement}
    </FullModal>
  );
}

CardModal.propTypes = {
  cardModal: PropTypes.shape({
    cards: CardsType,
    isStack: PropTypes.bool,
  }),
  isHandlingAction: PropTypes.bool.isRequired,
  updateCardModal: PropTypes.func.isRequired,
  handleGameAction: PropTypes.func.isRequired,
};

CardModal.defaultProps = {
  cardModal: { cards: [], isStack: false },
};
