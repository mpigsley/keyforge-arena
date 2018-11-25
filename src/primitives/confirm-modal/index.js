import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'primitives/modal';
import Button from 'primitives/button';

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  children,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onCancel={onCancel}
      cancelText="No"
      title="Confirm"
      actionButtons={[
        <Button primary key="save" onClick={onConfirm}>
          Yes
        </Button>,
      ]}
    >
      {children || 'Are you sure you want to continue?'}
    </Modal>
  );
}

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  children: PropTypes.node,
};

ConfirmModal.defaultProps = {
  onConfirm: () => {},
  onCancel: () => {},
  children: undefined,
};
