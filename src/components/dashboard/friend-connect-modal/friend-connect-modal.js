import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import Button from 'primitives/button';
import Input from 'primitives/input';
import Label from 'primitives/label';
import Modal from 'primitives/modal';

import { usePrevious, useTextInput } from 'utils/custom-effects';
import { searchForUser } from 'store/api/search.api';

import styles from './styles.module.scss';

ReactModal.setAppElement('#root');

export default function FriendConnectModal({ isOpen, onClose, userId }) {
  const previousIsOpen = usePrevious(isOpen);
  const [search, setSearch] = useTextInput();
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState('');
  const [connection, setConnection] = useState();

  useEffect(() => {
    if (previousIsOpen && !isOpen) {
      setResult('');
      setConnection();
    }
  });

  const onSearch = async () => {
    setIsSearching(true);
    const uid = await searchForUser(search, userId);
    setIsSearching(false);
    setConnection(uid);
    setResult(
      uid ? 'User found! Send request to continue.' : 'User was not found',
    );
  };

  return (
    <Modal
      title="Friend Connect"
      width="30rem"
      isOpen={isOpen}
      onCancel={onClose}
      actionButtons={[
        <Button primary key="change" disabled={!connection} onClick={() => {}}>
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
              onChange={setSearch}
            />
          </FlexContainer>
          <Button
            primary
            disabled={!search}
            className={styles.search}
            isLoading={isSearching}
            onClick={onSearch}
          >
            Search
          </Button>
        </FlexContainer>
      </div>
      <p
        className={classNames(styles.instructions, {
          [styles.success]: connection,
          [styles.failure]: !connection,
        })}
      >
        {result}
      </p>
    </Modal>
  );
}

FriendConnectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

FriendConnectModal.defaultProps = {
  userId: undefined,
};
