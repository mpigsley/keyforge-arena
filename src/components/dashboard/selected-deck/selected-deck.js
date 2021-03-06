import React from 'react';
import PropTypes from 'prop-types';

import ChangeSelectedModal from 'components/dashboard/change-selected-modal';
import FlexContainer from 'primitives/flex-container';
import HouseIcons from 'components/house-icons';
import Header from 'primitives/header';
import Button from 'primitives/button';

import styles from './styles.module.scss';

export default function SelectedDeck({ activeDeck, toggleChangeModal }) {
  if (!activeDeck) {
    return (
      <>
        <Header num="3" noMargin>
          Add Deck to Begin
        </Header>
        <FlexContainer className={styles.actions}>
          <Button className={styles.action} to="/deck">
            Deck List
          </Button>
        </FlexContainer>
      </>
    );
  }

  const { name, houses } = activeDeck;

  return (
    <>
      <FlexContainer>
        <Header num="2" noMargin>
          Selected Deck
        </Header>
      </FlexContainer>
      <Header num="3" noMargin className={styles.deckName}>
        {name}
      </Header>
      <HouseIcons houses={houses} />
      <FlexContainer className={styles.actions}>
        <Button primary className={styles.action} onClick={toggleChangeModal}>
          Change
        </Button>
        <Button className={styles.action} to="/deck">
          Manage Decks
        </Button>
      </FlexContainer>
      <ChangeSelectedModal />
    </>
  );
}

SelectedDeck.propTypes = {
  toggleChangeModal: PropTypes.func.isRequired,
  activeDeck: PropTypes.shape({
    name: PropTypes.string.isRequired,
    houses: PropTypes.shape().isRequired,
  }),
};

SelectedDeck.defaultProps = {
  activeDeck: undefined,
};
