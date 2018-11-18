import React from 'react';

import DeckSearch from 'components/deck-search';

import styles from './styles.module.scss';

export default function Decks() {
  return (
    <div className={styles.decks}>
      <DeckSearch className={styles.searchBar} />
      <div className={styles.list} />
      <div className={styles.details} />
    </div>
  );
}
