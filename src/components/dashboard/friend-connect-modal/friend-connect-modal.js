import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import Button from 'primitives/button';
import Input from 'primitives/input';
import Label from 'primitives/label';
import Modal from 'primitives/modal';

import { usePrevious } from 'utils/effects';
import { searchForUser } from 'store/api/search.api';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function FriendConnectModal({
  isOpen,
  isRequesting,
  onClose,
  userId,
  error,
  unsetError,
  requestConnection,
}) {
  const previousIsOpen = usePrevious(isOpen);
  const [state, setState] = useState({
    search: '',
    isSearching: false,
    isRequesting: false,
    result: '',
    connection: undefined,
  });

  const { search, isSearching, result, connection } = state;

  useEffect(() => {
    if (previousIsOpen && !isOpen) {
      setState({
        ...state,
        connection: undefined,
        search: '',
        result: '',
      });
    }
  });

  const onUpdateSearch = e => {
    if (error) {
      unsetError();
    }
    setState({ ...state, result: '', search: e.target.value });
  };

  const onSearch = async () => {
    setState({
      ...state,
      isSearching: true,
    });
    const uid = await searchForUser(search, userId);
    setState({
      ...state,
      isSearching: false,
      connection: uid,
      result: uid
        ? 'User found! Send request to continue.'
        : 'User was not found',
    });
  };

  return (
    <Modal
      title="Friend Connect"
      width="30rem"
      isOpen={isOpen}
      onCancel={onClose}
      actionButtons={[
        <Button
          primary
          key="change"
          disabled={!connection}
          onClick={() => requestConnection(connection)}
          isLoading={isRequesting}
        >
          Send Request
        </Button>,
      ]}
    >
      <div className={styles.container}>
        <p className={styles.instructions}>
          Search using either an email or a username and tag (e.g.
          username#tag).
        </p>
        <FlexContainer align="flexEnd" className={styles.searchContainer}>
          <FlexContainer direction="column" flex="1">
            <Label htmlFor="search">Email/Username</Label>
            <Input
              id="search"
              name="search"
              value={search}
              onChange={onUpdateSearch}
            />
          </FlexContainer>
          <Button
            primary
            disabled={!search}
            className={styles.search}
            isLoading={isSearching}
            onClick={() => onSearch()}
          >
            Search
          </Button>
        </FlexContainer>
      </div>
      <p
        className={classNames(styles.instructions, {
          [styles.success]: connection,
          [styles.failure]: !connection || error,
        })}
      >
        {error || result}
      </p>
    </Modal>
  );
}

FriendConnectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isRequesting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string,
  error: PropTypes.string,
  unsetError: PropTypes.func.isRequired,
  requestConnection: PropTypes.func.isRequired,
};

FriendConnectModal.defaultProps = {
  userId: undefined,
  error: undefined,
};
