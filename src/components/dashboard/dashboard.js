import React from 'react';
import PropTypes from 'prop-types';

import SelectedDeck from 'components/dashboard/selected-deck';
import FlexContainer from 'primitives/flex-container';
import Navigation from 'components/navigation';
import Spinner from 'primitives/spinner';

import styles from './styles.module.scss';

export default function Dashboard({ isInitialized }) {
  let content;
  if (!isInitialized) {
    content = (
      <FlexContainer justify="center" className={styles.loadingContainer}>
        <Spinner size={100} />
      </FlexContainer>
    );
  } else {
    content = <SelectedDeck />;
  }

  return (
    <Navigation>
      <div className={styles.container}>{content}</div>
    </Navigation>
  );
}

Dashboard.propTypes = {
  isInitialized: PropTypes.bool.isRequired,
};
