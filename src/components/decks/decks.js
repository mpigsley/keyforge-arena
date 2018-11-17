import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';
import Button from 'primitives/button';
import Input from 'primitives/input';

import styles from './styles.module.scss';

export default function Decks({ submitNewDeck }) {
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <FlexContainer className={styles.form} align="center" justify="center">
      <FlexContainer className={styles.row} direction="column" align="center">
        <Input
          placeholder="Share link from keyforgegame.com"
          value={link}
          onChange={e => setLink(e.target.value)}
        />
        <Button
          isLoading={isSubmitting}
          className={styles.submit}
          onClick={async () => {
            setIsSubmitting(true);
            try {
              await submitNewDeck(link);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          Submit
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
}

Decks.propTypes = {
  submitNewDeck: PropTypes.func.isRequired,
};
