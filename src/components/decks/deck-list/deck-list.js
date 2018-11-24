import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { size } from 'constants/lodash';

import FlexContainer from 'primitives/flex-container';
import HouseIcons from 'components/house-icons';

import styles from './styles.module.scss';

export default function DeckList({ className, decks, houseImages }) {
  return (
    <div className={className}>
      {decks.map(({ key, name, houses }) => {
        let imgRow;
        if (size(houseImages)) {
          imgRow = <HouseIcons houses={houses} />;
        }
        return (
          <NavLink
            to={`/decks/${key}`}
            activeClassName={styles['item--active']}
            className={styles.item}
            key={key}
          >
            <FlexContainer direction="column">
              <span className={styles.name}>{name}</span>
              {imgRow}
            </FlexContainer>
          </NavLink>
        );
      })}
    </div>
  );
}

DeckList.propTypes = {
  className: PropTypes.string,
  houseImages: PropTypes.shape({}).isRequired,
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
