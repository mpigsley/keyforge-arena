/* eslint-disable react/no-array-index-key */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import ConfirmModal from 'primitives/confirm-modal';
import IconButton from 'primitives/icon-button';
import { Trash } from 'constants/icons';
import { map, size, sortBy, capitalize } from 'constants/lodash';
import coreCards from 'constants/expansions/cota';

import styles from './styles.module.scss';

export default function DeckDetails({
  decks,
  selected,
  className,
  removeDeck,
  houseImages,
}) {
  const [isConfirmDelete, setConfirmDelete] = useState(false);
  const deck = decks[selected];
  if (!deck) {
    return <div className={className} />;
  }

  const { name, houses } = deck;
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
        <div className={styles.content}>
          <FlexContainer className={styles.houses}>
            {map(houses, (cards, house) => (
              <FlexContainer
                key={house}
                direction="column"
                className={styles.house}
              >
                <FlexContainer align="center" direction="column">
                  {!!size(houseImages) && (
                    <img
                      className={styles.houseImg}
                      src={houseImages[house]}
                      alt={house}
                    />
                  )}
                  <h3>{capitalize(house)}</h3>
                </FlexContainer>
                <FlexContainer direction="column" className={styles.cards}>
                  {sortBy(cards, parseInt).map((card, i) => (
                    <span className={styles.card} key={`${card}-${i}`}>
                      <span className={styles.cardNum}>{card}</span>
                      <span>{coreCards[card].name}</span>
                    </span>
                  ))}
                </FlexContainer>
              </FlexContainer>
            ))}
          </FlexContainer>
        </div>
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
  houseImages: PropTypes.shape(),
  cardImages: PropTypes.shape(),
};

DeckDetails.defaultProps = {
  selected: '',
  className: null,
  houseImages: {},
  cardImages: {},
};
