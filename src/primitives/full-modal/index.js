import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import FlexContainer from 'primitives/flex-container';
import Header from 'primitives/header';

import { X } from 'constants/icons';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function FullModal({ title, onClose, children, ...props }) {
  return (
    <ReactModal
      contentLabel={title}
      ariaHideApp={false}
      onClose={onClose}
      {...props}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.container}>
        <FlexContainer align="center">
          <Header num="1" className={styles.header}>
            {title}
          </Header>
          <X className={styles.close} onClick={onClose} size={50} />
        </FlexContainer>
        {children}
      </div>
    </ReactModal>
  );
}

FullModal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
};
