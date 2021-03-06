import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import HouseIcons from 'components/house-icons';
import Header from 'primitives/header';
import Button from 'primitives/button';
import Modal from 'primitives/modal';

import { CheckCircle, Circle } from 'constants/icons';
import { usePrevious } from 'utils/effects';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function ChangeSelectedModal({
  decks,
  isOpen,
  isChanging,
  toggleChangeModal,
  activeDeck,
  changeSelected,
}) {
  const previousIsOpen = usePrevious(isOpen);
  const [selected, setSelected] = useState();

  useEffect(() => {
    if (!previousIsOpen && isOpen) {
      setSelected(activeDeck.key);
    }
  });

  const onConfirm = () => {
    if (selected !== activeDeck.key) {
      changeSelected(activeDeck.key, selected);
    }
  };

  return (
    <Modal
      title="Change Selected Deck"
      width="30rem"
      noMargin
      isOpen={isOpen}
      onCancel={toggleChangeModal}
      actionButtons={[
        <Button primary key="change" onClick={onConfirm} isLoading={isChanging}>
          Change
        </Button>,
      ]}
    >
      <div className={styles.container}>
        {decks.map(({ key, name, houses }) => {
          const isSelected = key === selected;
          const Icon = isSelected ? CheckCircle : Circle;
          return (
            <FlexContainer
              key={key}
              align="center"
              onClick={() => setSelected(key)}
              className={classNames(styles.row, {
                [styles['row--selected']]: isSelected,
              })}
            >
              <Icon
                size="30px"
                className={classNames(styles.icon, {
                  [styles['icon--selected']]: isSelected,
                })}
              />
              <FlexContainer direction="column">
                <Header num="4" noMargin>
                  {name}
                </Header>
                <HouseIcons houses={houses} />
              </FlexContainer>
            </FlexContainer>
          );
        })}
      </div>
    </Modal>
  );
}

ChangeSelectedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isChanging: PropTypes.bool.isRequired,
  toggleChangeModal: PropTypes.func.isRequired,
  activeDeck: PropTypes.shape({
    key: PropTypes.string.isRequired,
  }).isRequired,
  changeSelected: PropTypes.func.isRequired,
  decks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      houses: PropTypes.shape().isRequired,
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
