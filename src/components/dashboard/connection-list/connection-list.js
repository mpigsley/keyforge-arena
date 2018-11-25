import React, { useState } from 'react';

import FriendConnectModal from 'components/dashboard/friend-connect-modal';
import FlexContainer from 'primitives/flex-container';
import Header from 'primitives/header';
import Button from 'primitives/button';

import styles from './styles.module.scss';

export default function ConnectionList() {
  const [isFriendConnectOpen, setIsFriendConnectOpen] = useState(false);
  return (
    <>
      <FlexContainer
        flex="1"
        align="center"
        justify="center"
        direction="column"
        className={styles.container}
      >
        <Header num="2" noMargin>
          Connection List
        </Header>
        <Header num="4" minor>
          Connect with other users to direct challenge them.
        </Header>
        <Button onClick={() => setIsFriendConnectOpen(true)}>Connect</Button>
      </FlexContainer>
      <FriendConnectModal
        isOpen={isFriendConnectOpen}
        onClose={() => setIsFriendConnectOpen(false)}
      />
    </>
  );
}
