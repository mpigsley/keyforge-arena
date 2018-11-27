import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlexContainer from 'primitives/flex-container';
import Button from 'primitives/button';
import Header from 'primitives/header';

import styles from './styles.module.scss';

export default function ConnectionListItem({ connection }) {
  const { username, tag, pending, isOnline, lastOnline } = connection;
  let action = <Button className={styles.actionBtn}>Challenge</Button>;
  if (pending) {
    action = (
      <>
        <Button className={styles.actionBtn}>Remove</Button>
        <Button primary className={styles.actionBtn}>
          Add
        </Button>
      </>
    );
  } else if (!isOnline) {
    action = <span>{lastOnline}</span>;
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
  connection: PropTypes.shape({
    username: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    isOnline: PropTypes.bool.isRequired,
    pending: PropTypes.bool.isRequired,
    lastOnline: PropTypes.string.isRequired,
  }).isRequired,
};
