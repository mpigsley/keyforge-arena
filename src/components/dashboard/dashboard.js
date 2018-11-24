import React from 'react';
import PropTypes from 'prop-types';
import ReactHintFactory from 'react-hint';

import SelectedDeck from 'components/dashboard/selected-deck';
import FlexContainer from 'primitives/flex-container';
import Navigation from 'components/navigation';
import Spinner from 'primitives/spinner';
import Header from 'primitives/header';

import styles from './styles.module.scss';

const ReactHint = ReactHintFactory(React);

const loader = (
  <FlexContainer justify="center" className={styles.loadingContainer}>
    <Spinner size={100} />
  </FlexContainer>
);

export default function Dashboard({ isInitialized }) {
  let content;
  if (!isInitialized) {
    content = loader;
  } else {
    content = (
      <FlexContainer direction="column">
        <SelectedDeck />
        <FlexContainer className={styles.games}>
          <div className={styles.friendsPlaceholder} />
          <FlexContainer direction="column" flex="1">
            <button
              type="button"
              className={styles.matchmakingBtn}
              data-rh="Matchmaking coming soon!"
            >
              <Header num="2" noMargin>
                Matchmaking
              </Header>
              <Header num="4" className={styles.matchmakingText}>
                Use your selected deck to play against a random opponent
              </Header>
            </button>
            <button
              type="button"
              className={styles.matchmakingBtn}
              data-rh="Random deck coming soon!"
            >
              <Header num="2" noMargin>
                Random Deck
              </Header>
              <Header num="4" className={styles.matchmakingText}>
                You’ll be given a random deck and a random opponent
              </Header>
            </button>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    );
  }

  return (
    <Navigation>
      <div className={styles.container}>{content}</div>
      <ReactHint events={{ hover: true }} position="top" />
    </Navigation>
  );
}

Dashboard.propTypes = {
  isInitialized: PropTypes.bool.isRequired,
};
