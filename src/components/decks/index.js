import React from 'react';
import PropTypes from 'prop-types';

import Navigation from 'components/navigation';
import DeckDetails from 'components/decks/deck-details';
import DeckSearch from 'components/decks/deck-search';
import DeckList from 'components/decks/deck-list';
import CardTooltip from 'components/decks/card-tooltip';

import styles from './styles.module.scss';

export default function Decks({ match }) {
  return (
    <Navigation>
      <div className={styles.decks}>
        <DeckSearch className={styles.searchBar} />
        <DeckList selected={match.params.id} className={styles.list} />
        <DeckDetails selected={match.params.id} className={styles.details} />
      </div>
      <CardTooltip />
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
