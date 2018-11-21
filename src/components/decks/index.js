import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Navigation from 'components/navigation';
import DeckDetails from 'components/decks/deck-details';
import DeckSearch from 'components/decks/deck-search';
import DeckList from 'components/decks/deck-list';
import CardTooltip from 'components/decks/card-tooltip';
import AddDeckModal from 'components/decks/add-deck-modal';

import styles from './styles.module.scss';

export default function Decks({ match }) {
  const [isAddDeckOpen, setIsAddDeckOpen] = useState(false);
  const openDeckModal = () => setIsAddDeckOpen(true);
  return (
    <Navigation>
      <div className={styles.decks}>
        <DeckSearch
          className={styles.searchBar}
          openDeckModal={openDeckModal}
        />
        <DeckList selected={match.params.id} className={styles.list} />
        <DeckDetails
          selected={match.params.id}
          className={styles.details}
          openDeckModal={openDeckModal}
        />
      </div>
      <CardTooltip />
      <AddDeckModal
        isOpen={isAddDeckOpen}
        onClose={() => setIsAddDeckOpen(false)}
      />
    </Navigation>
  );
}

Decks.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
