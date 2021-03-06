import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import Spinner from 'primitives/spinner';
import Button from 'primitives/button';
import Header from 'primitives/header';
import { size, includes } from 'constants/lodash';

import styles from './styles.module.scss';

export default function ConnectionListItem({
  decks,
  connection,
  isCancelling,
  isAccepting,
  isReplyingTo,
  connectionReply,
  challengeConnection,
  cancelChallenge,
  acceptChallenge,
}) {
  const {
    username,
    tag,
    pending,
    isOnline,
    lastOnline,
    key,
    challenge,
    isChallengeCreator,
  } = connection;

  const hasDecks = !!size(decks);
  let action = (
    <div
      data-rh={hasDecks ? undefined : 'To challenge, add at least one deck.'}
    >
      <Button
        className={styles.actionBtn}
        onClick={() => challengeConnection(key)}
        disabled={!hasDecks}
      >
        Challenge
      </Button>
    </div>
  );

  if (
    (challenge && includes([isAccepting, isCancelling], challenge)) ||
    isReplyingTo === key
  ) {
    action = <Spinner />;
  } else if (pending) {
    action = (
      <>
        <Button
          primary
          className={styles.actionBtn}
          onClick={() => connectionReply(key, true)}
        >
          Add
        </Button>
        <Button
          className={styles.actionBtn}
          onClick={() => connectionReply(key, false)}
        >
          Remove
        </Button>
      </>
    );
  } else if (challenge && isChallengeCreator) {
    action = (
      <Button
        className={styles.actionBtn}
        onClick={() => cancelChallenge(challenge)}
      >
        Cancel Challenge
      </Button>
    );
  } else if (challenge) {
    action = (
      <>
        <div
          data-rh={hasDecks ? undefined : 'To accept, add at least one deck.'}
        >
          <Button
            disabled={!hasDecks}
            primary
            className={styles.actionBtn}
            onClick={() => acceptChallenge(challenge)}
          >
            Accept Challenge
          </Button>
        </div>
        <Button
          className={styles.actionBtn}
          onClick={() => cancelChallenge(challenge)}
        >
          Deny
        </Button>
      </>
    );
  } else if (!isOnline) {
    action = <span className={styles.lastOnline}>{lastOnline}</span>;
  }

  return (
    <FlexContainer className={styles.row} align="center">
      <div
        className={classNames(styles.status, {
          [styles['status--online']]: isOnline,
        })}
      />
      <FlexContainer flex="1" align="flexEnd">
        <Header noMargin num="4">
          {username}
        </Header>
        <span className={styles.tag}>#{tag}</span>
      </FlexContainer>
      {action}
    </FlexContainer>
  );
}

ConnectionListItem.propTypes = {
  connectionReply: PropTypes.func.isRequired,
  challengeConnection: PropTypes.func.isRequired,
  cancelChallenge: PropTypes.func.isRequired,
  acceptChallenge: PropTypes.func.isRequired,
  isReplyingTo: PropTypes.string,
  isCancelling: PropTypes.string,
  isAccepting: PropTypes.string,
  decks: PropTypes.shape().isRequired,
  connection: PropTypes.shape({
    username: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    isOnline: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    lastOnline: PropTypes.string.isRequired,
  }).isRequired,
};

ConnectionListItem.defaultProps = {
  isReplyingTo: undefined,
  isCancelling: undefined,
  isAccepting: undefined,
};
