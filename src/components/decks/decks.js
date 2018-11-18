import React from 'react';

import DeckSearch from 'components/deck-search';
import DeckList from 'components/deck-list';

import styles from './styles.module.scss';

export default function Decks() {
  return (
    <div className={styles.decks}>
      <DeckSearch className={styles.searchBar} />
      <DeckList className={styles.list} />
      <div className={styles.details} />
    </div>
  );
}
