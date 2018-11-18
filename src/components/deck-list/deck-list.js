import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import FlexContainer from 'primitives/flex-container';

import styles from './styles.module.scss';

export default function DeckList({ className, decks }) {
  return (
    <div className={className}>
      {decks.map(({ key, name }) => (
        <Link to={`/decks/${key}`} className={styles.item} key={key}>
          <FlexContainer direction="column">
            <span className={styles.name}>{name}</span>
          </FlexContainer>
        </Link>
      ))}
    </div>
  );
}

DeckList.propTypes = {
  className: PropTypes.string,
  decks: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

DeckList.defaultProps = {
  className: undefined,
};
