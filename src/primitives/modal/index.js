import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactModal from 'react-modal';

import { X } from 'constants/icons';
import FlexContainer from 'primitives/flex-container';
import Button from 'primitives/button';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function Modal({
  title,
  children,
  cancelText,
  footerText,
  onCancel,
  actionButtons,
  width,
  hideHeader,
  ...rest
}) {
  let header = null;
  if (!hideHeader) {
    header = (
      <FlexContainer
        align="center"
        justify="spaceBetween"
        className={classNames(styles.section, styles.header)}
      >
        <h3 className={styles.title}>{title}</h3>
        <X className={styles.close} onClick={onCancel} size={30} />
      </FlexContainer>
    );
  }

  return (
    <ReactModal
      contentLabel={title}
      ariaHideApp={false}
      style={{ content: { width } }}
      {...rest}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <FlexContainer direction="column">
        {header}
        <div className={styles.content}>{children}</div>
        <FlexContainer
          align="center"
          justify={footerText ? 'spaceBetween' : 'flexEnd'}
          className={classNames(styles.section, styles.footer)}
        >
          {footerText}
          <span>
            <Button className={styles.footerBtn} onClick={onCancel}>
              {cancelText}
            </Button>
            {React.Children.map(actionButtons, button =>
              React.cloneElement(button, {
                className: classNames(button.props.className, styles.footerBtn),
              }),
            )}
          </span>
        </FlexContainer>
      </FlexContainer>
    </ReactModal>
  );
}

Modal.propTypes = {
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  cancelText: PropTypes.string,
  footerText: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  actionButtons: PropTypes.arrayOf(PropTypes.node),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hideHeader: PropTypes.bool,
};

Modal.defaultProps = {
  className: undefined,
  overlayClassName: undefined,
  cancelText: 'Cancel',
  footerText: undefined,
  actionButtons: undefined,
  width: 400,
  hideHeader: false,
};
