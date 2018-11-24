import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ChangeSelectedModal from 'components/dashboard/change-selected-modal';
import FlexContainer from 'primitives/flex-container';
import HouseIcons from 'components/house-icons';
import Header from 'primitives/header';
import Button from 'primitives/button';

import styles from './styles.module.scss';

export default function SelectedDeck({ selectedDeck }) {
  const [isChanging, setIsChanging] = useState(false);

  if (!selectedDeck) {
    return (
      <div className={styles.container}>
        <Header num="3" noMargin>
          Add Deck to Begin
        </Header>
        <FlexContainer className={styles.actions}>
          <Button className={styles.action} to="/decks">
            Deck List
          </Button>
        </FlexContainer>
      </div>
    );
  }

  const { name, houses } = selectedDeck;

  return (
    <div className={styles.container}>
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
        <Button
          primary
          className={styles.action}
          onClick={() => setIsChanging(true)}
        >
          Change
        </Button>
        <Button className={styles.action} to="/decks">
          Manage Decks
        </Button>
      </FlexContainer>
      <ChangeSelectedModal
        isOpen={isChanging}
        onClose={() => setIsChanging(false)}
      />
    </div>
  );
}

SelectedDeck.propTypes = {
  selectedDeck: PropTypes.shape({
    name: PropTypes.string.isRequired,
    houses: PropTypes.shape().isRequired,
  }),
};

SelectedDeck.defaultProps = {
  selectedDeck: undefined,
};
