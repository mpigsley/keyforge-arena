import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import IconButton from 'primitives/icon-button';
import Input from 'primitives/input';
import { Plus } from 'constants/icons';

import styles from './styles.module.scss';

export default function DeckSearch({
  className,
  searchTerm,
  setSearchTerm,
  toggleSubmitModal,
}) {
  return (
    <>
      <div className={classNames(className, styles.container)}>
        <FlexContainer align="center" className={styles.searchContainer}>
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <IconButton className={styles.addBtn} onClick={toggleSubmitModal}>
            <Plus />
          </IconButton>
        </FlexContainer>
      </div>
    </>
  );
}

DeckSearch.propTypes = {
  className: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  toggleSubmitModal: PropTypes.func.isRequired,
};
