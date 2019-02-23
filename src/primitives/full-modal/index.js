import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import Header from 'primitives/header';

import { X } from 'constants/icons';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function FullModal({
  title,
  subTitle,
  onClose,
  children,
  persisted,
  ...props
}) {
  return (
    <ReactModal
      contentLabel={title}
      ariaHideApp={false}
      onClose={!persisted ? onClose : () => {}}
      {...props}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div
        className={classNames(styles.container, {
          [styles['container--fullHeight']]: persisted,
        })}
      >
        {!persisted && (
          <FlexContainer justify="flexEnd">
            <X className={styles.close} onClick={onClose} size={50} />
          </FlexContainer>
        )}
        <FlexContainer direction="column" className={styles.contentContainer}>
          <FlexContainer
            align="center"
            direction="column"
            className={styles.headers}
          >
            <Header num="1">{title}</Header>
            {!!subTitle && (
              <Header minor num="3">
                {subTitle}
              </Header>
            )}
          </FlexContainer>
          {children}
        </FlexContainer>
      </div>
    </ReactModal>
  );
}

FullModal.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  persisted: PropTypes.bool,
};

FullModal.defaultProps = {
  title: '',
  subTitle: undefined,
  persisted: false,
};
