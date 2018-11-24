import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import Modal from 'primitives/modal';
import Button from 'primitives/button';
import FlexContainer from 'primitives/flex-container';
import { usePrevious } from 'utils/custom-effects';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function ChangeSelectedModal({
  isOpen,
  onClose,
  selectedDeck,
  changeSelectedDeck,
}) {
  const [error, setError] = useState();
  const [isChanging, setIsChanging] = useState(false);
  const previousIsOpen = usePrevious(isOpen);
  const [selected, setSelected] = useState();

  useEffect(() => {
    if (!previousIsOpen && isOpen) {
      setSelected(selectedDeck.key);
    }
  });

  const onConfirm = async () => {
    setIsChanging(true);
    try {
      await changeSelectedDeck(selected);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setIsChanging(false);
    }
  };

  const renderError = () => {
    if (!error) {
      return null;
    }
    return (
      <FlexContainer className={styles.error} justify="center">
        {error}
      </FlexContainer>
    );
  };

  return (
    <Modal
      width="30rem"
      title="Change Selected Deck"
      isOpen={isOpen}
      onCancel={onClose}
      actionButtons={[
        <Button primary key="change" onClick={onConfirm} isLoading={isChanging}>
          Change
        </Button>,
      ]}
    >
      <FlexContainer direction="column">{renderError()}</FlexContainer>
    </Modal>
  );
}

ChangeSelectedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedDeck: PropTypes.shape({
    key: PropTypes.string.isRequired,
  }).isRequired,
  changeSelectedDeck: PropTypes.func.isRequired,
};
