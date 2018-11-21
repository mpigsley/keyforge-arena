import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Navigation from 'components/navigation';
import DeckDetails from 'components/decks/deck-details';
import DeckSearch from 'components/decks/deck-search';
import DeckList from 'components/decks/deck-list';
import CardTooltip from 'components/decks/card-tooltip';
import AddDeckModal from 'components/decks/add-deck-modal';

import { size, sortBy, map } from 'constants/lodash';

import styles from './styles.module.scss';

export default function Decks({ decks, toDeck, match }) {
  const [isAddDeckOpen, setIsAddDeckOpen] = useState(false);
  const openDeckModal = () => setIsAddDeckOpen(true);

  const selected = match.params.id;
  useEffect(() => {
    if (size(decks) && !selected) {
      const sortedDecks = sortBy(
        map(decks, (deck, key) => ({ ...deck, key })),
        'name',
      );
      if (sortedDecks.length) {
        toDeck(sortedDecks[0].key);
      }
    }
  });

  return (
    <Navigation>
      <div className={styles.decks}>
        <DeckSearch
          className={styles.searchBar}
          openDeckModal={openDeckModal}
        />
        <DeckList selected={selected} className={styles.list} />
        <DeckDetails
          selected={selected}
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
  decks: PropTypes.shape().isRequired,
  toDeck: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};
