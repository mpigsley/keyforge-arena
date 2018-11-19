/* eslint-disable react/no-array-index-key */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import ConfirmModal from 'primitives/confirm-modal';
import IconButton from 'primitives/icon-button';
import { Trash } from 'constants/icons';
import { map, size, sortBy, capitalize, uniq } from 'constants/lodash';
import coreCards from 'constants/expansions/cota';

import { ReactComponent as Common } from 'images/common.svg';
import { ReactComponent as Uncommon } from 'images/uncommon.svg';
import { ReactComponent as Rare } from 'images/rare.svg';
import { ReactComponent as Special } from 'images/special.svg';
import { ReactComponent as Maverick } from 'images/maverick.svg';

import styles from './styles.module.scss';

const RARITY = { Common, Uncommon, Rare, Special };

export default function DeckDetails({
  decks,
  selected,
  className,
  removeDeck,
  houseImages,
  fetchCardImages,
}) {
  const [isConfirmDelete, setConfirmDelete] = useState(false);
  const fetchImages = useCallback(
    () => {
      const deck = decks[selected];
      if (deck) {
        const { expansion, houses } = deck;
        const cards = Object.values(houses).reduce(
          (arr, houseCards) => [...arr, ...houseCards],
          [],
        );
        fetchCardImages(expansion, uniq(cards));
      }
    },
    [decks, selected],
  );
  useEffect(fetchImages);

  const deck = decks[selected];
  if (!deck) {
    return <div className={className} />;
  }

  const renderCard = (columnHouse, card, i) => {
    const { name, rarity, house } = coreCards[card];
    const Rarity = RARITY[rarity];
    const isMaverick = house.toLowerCase() !== columnHouse;
    return (
      <FlexContainer
        data-card={`${deck.expansion}-${card}`}
        key={`${card}-${i}`}
        align="center"
        className={styles.card}
      >
        <Rarity className={styles.rarity} />
        <span className={styles.cardNum}>{card}</span>
        <span>{name}</span>
        {isMaverick && <Maverick className={styles.maverick} />}
      </FlexContainer>
    );
  };

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
                  {sortBy(cards, parseInt).map((card, i) =>
                    renderCard(house, card, i),
                  )}
                </FlexContainer>
              </FlexContainer>
            ))}
          </FlexContainer>
        </div>
      </div>
      <ConfirmModal
        isOpen={isConfirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={onRemove}
      />
    </>
  );
}

DeckDetails.propTypes = {
  decks: PropTypes.shape().isRequired,
  selected: PropTypes.string,
  className: PropTypes.string,
  houseImages: PropTypes.shape(),
  removeDeck: PropTypes.func.isRequired,
  fetchCardImages: PropTypes.func.isRequired,
};

DeckDetails.defaultProps = {
  selected: '',
  className: null,
  houseImages: {},
  cardImages: {},
};
