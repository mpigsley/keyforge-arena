import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AddDeckModal from 'components/decks/add-deck-modal';
import FlexContainer from 'primitives/flex-container';
import IconButton from 'primitives/icon-button';
import Input from 'primitives/input';
import { Plus } from 'constants/icons';

import styles from './styles.module.scss';

export default function DeckSearch({ className, searchTerm, setSearchTerm }) {
  const [isAddDeckOpen, setIsAddDeckOpen] = useState(false);
  return (
    <>
      <div className={classNames(className, styles.container)}>
        <FlexContainer align="center" className={styles.searchContainer}>
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <IconButton
            className={styles.addBtn}
            onClick={() => setIsAddDeckOpen(true)}
          >
            <Plus />
          </IconButton>
        </FlexContainer>
      </div>
      <AddDeckModal
        isOpen={isAddDeckOpen}
        onClose={() => setIsAddDeckOpen(false)}
      />
    </>
  );
}

DeckSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};
