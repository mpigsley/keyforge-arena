import React, { useState } from 'react';

import FriendConnectModal from 'components/dashboard/friend-connect-modal';
import ConnectionListItem from 'components/dashboard/connection-list-item';
import FlexContainer from 'primitives/flex-container';
import IconButton from 'primitives/icon-button';
import Spinner from 'primitives/spinner';
import Header from 'primitives/header';
import Button from 'primitives/button';

import { size } from 'constants/lodash';
import { Plus } from 'constants/icons';

import styles from './styles.module.scss';

export default function ConnectionList({ isInitialized, connections }) {
  const [isFriendConnectOpen, setIsFriendConnectOpen] = useState(false);

  let content;
  const isCentered = !isInitialized || !size(connections);
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
          <Button onClick={() => setIsFriendConnectOpen(true)}>Connect</Button>
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
          <IconButton onClick={() => setIsFriendConnectOpen(true)}>
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
      <FriendConnectModal
        isOpen={isFriendConnectOpen}
        onClose={() => setIsFriendConnectOpen(false)}
      />
    </>
  );
}
