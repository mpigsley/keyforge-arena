import React from 'react';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';
import IconButton from 'primitives/icon-button';
import Input from 'primitives/input';
import { Plus } from 'constants/icons';

import styles from './styles.module.scss';

export default function Decks({ searchTerm, setSearchTerm }) {
  return (
    <div className={styles.decks}>
      <div className={styles.searchBar}>
        <FlexContainer align="center" className={styles.searchContainer}>
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <IconButton className={styles.addBtn}>
            <Plus />
          </IconButton>
        </FlexContainer>
      </div>
      <div className={styles.list} />
      <div className={styles.details} />
    </div>
  );
}

Decks.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};
