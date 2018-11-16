import React, { useState } from 'react';

import FlexContainer from 'primitives/flex-container';
import Button from 'primitives/button';
import Input from 'primitives/input';

import styles from './styles.module.scss';

export default function Decks() {
  const [link, setLink] = useState('');

  return (
    <FlexContainer className={styles.form} align="center" justify="center">
      <FlexContainer className={styles.row} direction="column" align="center">
        <Input
          placeholder="Share link from keyforgegame.com"
          value={link}
          onChange={e => setLink(e.target.value)}
        />
        <Button className={styles.submit}>Submit</Button>
      </FlexContainer>
    </FlexContainer>
  );
}
