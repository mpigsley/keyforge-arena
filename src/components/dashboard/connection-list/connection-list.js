import React from 'react';
import PropTypes from 'prop-types';

import FriendConnectModal from 'components/dashboard/friend-connect-modal';
import ConnectionListItem from 'components/dashboard/connection-list-item';
import FlexContainer from 'primitives/flex-container';
import IconButton from 'primitives/icon-button';
import Spinner from 'primitives/spinner';
import Header from 'primitives/header';
import Button from 'primitives/button';

import { Plus } from 'constants/icons';

import styles from './styles.module.scss';

export default function ConnectionList({
  isInitialized,
  connections,
  toggleConnectModal,
}) {
  let content;
  const isCentered = !isInitialized || !connections.length;
  if (isCentered) {
    content = <Spinner />;
    if (isInitialized) {
      content = (
        <>
          <Header num="2" noMargin>
            Connection List
          </Header>
          <Header num="4" minor>
            Connect with other users to direct challenge them.
          </Header>
          <Button onClick={toggleConnectModal}>Connect</Button>
        </>
      );
    }
  } else {
    content = (
      <>
        <FlexContainer
          className={styles.header}
          align="center"
          justify="spaceBetween"
        >
          <Header num="2" noMargin>
            Connection List
          </Header>
          <IconButton onClick={toggleConnectModal}>
            <Plus />
          </IconButton>
        </FlexContainer>
        <div className={styles.scrollContainer}>
          {connections.map(connection => (
            <ConnectionListItem key={connection.key} connection={connection} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <FlexContainer
        flex="1"
        align="center"
        justify={isCentered ? 'center' : 'flexStart'}
        direction="column"
        className={styles.container}
      >
        {content}
      </FlexContainer>
      <FriendConnectModal />
    </>
  );
}

ConnectionList.propTypes = {
  isInitialized: PropTypes.bool.isRequired,
  connections: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  toggleConnectModal: PropTypes.func.isRequired,
};
