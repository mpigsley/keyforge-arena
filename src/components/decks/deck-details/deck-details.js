import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import ConfirmModal from 'primitives/confirm-modal';
import IconButton from 'primitives/icon-button';
import { Trash } from 'constants/icons';

import styles from './styles.module.scss';

export default function DeckDetails({
  decks,
  selected,
  className,
  removeDeck,
}) {
  const [isConfirmDelete, setConfirmDelete] = useState(false);
  const { name } = decks[selected] || {};

  const onRemove = async () => {
    setConfirmDelete(false);
    await removeDeck(selected);
  };

  return (
    <>
      <div className={classNames(styles.container, className)}>
        <FlexContainer
          align="center"
          justify="spaceBetween"
          className={styles.header}
        >
          <h1 className={styles.name}>{name}</h1>
          <IconButton onClick={() => setConfirmDelete(true)}>
            <Trash />
          </IconButton>
        </FlexContainer>
        <div className={styles.content} />
      </div>
      <ConfirmModal
        isOpen={isConfirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => onRemove()}
      />
    </>
  );
}

DeckDetails.propTypes = {
  decks: PropTypes.shape().isRequired,
  selected: PropTypes.string,
  className: PropTypes.string,
  removeDeck: PropTypes.func.isRequired,
};

DeckDetails.defaultProps = {
  selected: '',
  className: null,
};
