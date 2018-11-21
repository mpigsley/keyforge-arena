import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import Modal from 'primitives/modal';
import Button from 'primitives/button';
import FlexContainer from 'primitives/flex-container';
import Label from 'primitives/label';
import Input from 'primitives/input';
import { useTextInput } from 'utils/custom-effects';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function AddDeckModal({ isOpen, onClose, submitNewDeck }) {
  const [error, setError] = useState();
  const [isImporting, setIsImporting] = useState(false);
  const [link, setLink] = useTextInput();

  useEffect(() => {
    setError();
    onClose();
  });

  const onConfirm = async () => {
    setIsImporting(true);
    try {
      await submitNewDeck(link);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setIsImporting(false);
    }
  };

  const submitOnEnter = e => {
    if (e.key === 'Enter') {
      onConfirm();
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
      title="Import Deck"
      isOpen={isOpen}
      onCancel={onClose}
      actionButtons={[
        <Button key="submit" onClick={onConfirm} isLoading={isImporting}>
          Import
        </Button>,
      ]}
    >
      <FlexContainer direction="column">
        <p className={styles.paragraph}>
          To add a new deck, copy and paste the link of a specific deck from
          www.keyforgegame.com. The deck does not need to belong to you to
          import it.
        </p>
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          name="link"
          value={link}
          onChange={setLink}
          onKeyPress={submitOnEnter}
        />
        {renderError()}
      </FlexContainer>
    </Modal>
  );
}

AddDeckModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  submitNewDeck: PropTypes.func.isRequired,
};
