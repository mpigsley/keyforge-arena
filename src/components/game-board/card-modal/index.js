import React from 'react';
import ReactModal from 'react-modal';

import FlexContainer from 'primitives/flex-container';
import FullModal from 'primitives/full-modal';

import { ZOOMED_WIDTH, CARD_RATIO } from 'constants/game-board';
import { CardsType } from 'constants/types';
import { reverse } from 'constants/lodash';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function CardModal({ cards, ...props }) {
  return (
    <FullModal isOpen={!!cards.length} {...props}>
      <FlexContainer
        direction="column"
        justify="center"
        className={styles.container}
      >
        <FlexContainer className={styles.cardContainer}>
          {reverse(cards).map(({ card, image, house }, i) => (
            <FlexContainer
              className={styles.card}
              direction="column"
              align={i === 0 ? 'flexStart' : 'flexEnd'}
              justify="flexEnd"
              key={`${card}-${i}` /* eslint-disable-line */}
            >
              {i === 0 && cards.length > 1 && (
                <span className={styles.directionText}>Top</span>
              )}
              {i === cards.length - 1 && cards.length > 1 && (
                <span className={styles.directionText}>Bottom</span>
              )}
              <img
                style={{
                  width: ZOOMED_WIDTH,
                  height: ZOOMED_WIDTH / CARD_RATIO,
                }}
                src={image.link}
                alt={`${house}-${card}`}
              />
            </FlexContainer>
          ))}
        </FlexContainer>
      </FlexContainer>
    </FullModal>
  );
}

CardModal.propTypes = {
  cards: CardsType,
};

CardModal.defaultProps = {
  cards: [],
};
