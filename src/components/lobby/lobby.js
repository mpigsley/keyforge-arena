import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';
import Button from 'primitives/button';
import Header from 'primitives/header';

import styles from './styles.module.scss';

export default function Lobby({ currentLobby, toHome, cancelChallenge }) {
  useEffect(() => {
    if (!currentLobby) {
      toHome();
    }
  });

  return (
    <FlexContainer
      direction="column"
      align="center"
      justify="center"
      className={styles.container}
    >
      <Header num="1">The game is about to begin.</Header>
      <Header num="3" minor>
        Waiting on opponent to accept the challenge.
      </Header>
      <Button onClick={() => cancelChallenge(currentLobby)}>
        Cancel Challenge
      </Button>
    </FlexContainer>
  );
}

Lobby.propTypes = {
  currentLobby: PropTypes.string,
  toHome: PropTypes.func.isRequired,
  cancelChallenge: PropTypes.func.isRequired,
};

Lobby.defaultProps = {
  currentLobby: undefined,
};
