import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.module.scss';

export default function DeckDetails({ decks, selected, className }) {
  const { name } = decks[selected] || {};
  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.header}>
        <h1>{name}</h1>
      </div>
      <div className={styles.content} />
    </div>
  );
}

DeckDetails.propTypes = {
  decks: PropTypes.shape().isRequired,
  selected: PropTypes.string,
  className: PropTypes.string,
};

DeckDetails.defaultProps = {
  selected: '',
  className: null,
};
