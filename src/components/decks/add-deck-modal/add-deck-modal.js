import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import Modal from 'primitives/modal';
import Button from 'primitives/button';
import FlexContainer from 'primitives/flex-container';
import Label from 'primitives/label';
import Input from 'primitives/input';
import Link from 'primitives/link';
import { useTextInput, usePrevious } from 'utils/effects';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function AddDeckModal({
  isOpen,
  error,
  isSubmitting,
  toggleSubmitModal,
  submitNewDeck,
}) {
  const [link, setLink] = useTextInput();
  const previousIsOpen = usePrevious(isOpen);

  useEffect(() => {
    if (previousIsOpen && !isOpen) {
      setLink();
    }
  });

  const submitOnEnter = e => {
    if (e.key === 'Enter') {
      submitNewDeck(link);
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
      onCancel={toggleSubmitModal}
      actionButtons={[
        <Button
          primary
          key="submit"
          onClick={() => submitNewDeck(link)}
          isLoading={isSubmitting}
        >
          Import
        </Button>,
      ]}
    >
      <FlexContainer direction="column">
        <p className={styles.paragraph}>
          To add a new deck, copy and paste the URL of a specific deck from{' '}
          <Link to="https://www.keyforgegame.com/" inNewTab>
            www.keyforgegame.com
          </Link>
          . The deck does not need to belong to you to import it.
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
  isSubmitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  toggleSubmitModal: PropTypes.func.isRequired,
  submitNewDeck: PropTypes.func.isRequired,
};

AddDeckModal.defaultProps = {
  error: undefined,
};
