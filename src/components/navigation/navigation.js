import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';
import LoginModal from 'components/login-modal';
import { LogOut } from 'constants/icons';

import styles from './styles.module.scss';

export default function Navigation({
  user,
  signout,
  children,
  isLoggedIn,
  isInitialized,
  toggleLoginModal,
}) {
  const renderProtectedLink = link => (isLoggedIn ? link : null);

  let links;
  if (isInitialized) {
    links = (
      <FlexContainer>
        {renderProtectedLink(
          <NavLink
            to="/decks"
            className={styles.navLink}
            activeClassName={styles['navLink--active']}
          >
            My Decks
          </NavLink>,
        )}
        {renderProtectedLink(
          <NavLink
            to="/profile"
            className={styles.navLink}
            activeClassName={styles['navLink--active']}
          >
            {(user || {}).username}
            <span className={styles.tag}>#{(user || {}).tag}</span>
          </NavLink>,
        )}
        <button
          type="button"
          className={styles.navLink}
          onClick={() => {
            if (isLoggedIn) {
              signout();
            } else {
              toggleLoginModal();
            }
          }}
        >
          {isLoggedIn ? <LogOut /> : 'Log In'}
        </button>
      </FlexContainer>
    );
  }

  return (
    <>
      <div className={styles.app}>
        <nav className={styles.nav}>
          <FlexContainer
            className={styles.navLinks}
            align="center"
            justify="spaceBetween"
          >
            <Link
              className={styles.homeText}
              to={isLoggedIn ? '/dashboard' : '/'}
            >
              <FlexContainer align="center">
                <span className={styles.keyforgeText}>Keyforge</span>
                <span className={styles.arenaText}>Arena</span>
              </FlexContainer>
            </Link>
            {links}
          </FlexContainer>
        </nav>
        <div className={styles.content}>{children}</div>
      </div>
      <LoginModal />
    </>
  );
}

Navigation.propTypes = {
  children: PropTypes.node.isRequired,
  signout: PropTypes.func.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isInitialized: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    tag: PropTypes.string,
    username: PropTypes.string,
  }),
};

Navigation.defaultProps = {
  user: {},
};
