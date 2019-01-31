import React from 'react';
import ReactModal from 'react-modal';

import { CardsType } from 'constants/types';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function CardModal({ cards, ...props }) {
  return (
    <ReactModal
      isOpen={!!cards}
      contentLabel="Card Pile List"
      ariaHideApp={false}
      {...props}
      className={styles.modal}
      overlayClassName={styles.overlay}
    />
  );
}

CardModal.propTypes = {
  cards: CardsType,
};

CardModal.defaultProps = {
  cards: undefined,
};
