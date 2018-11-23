import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';
import LoginModal from 'components/login-modal';
import { LogOut } from 'constants/icons';

import styles from './styles.module.scss';

export default function Navigation({
  children,
  signout,
  isLoggedIn,
  isInitialized,
}) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
            Profile
          </NavLink>,
        )}
        <button
          type="button"
          className={styles.navLink}
          onClick={() => {
            if (isLoggedIn) {
              signout();
            } else {
              setIsLoginOpen(true);
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
            <Link className={styles.homeText} to="/">
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
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}

Navigation.propTypes = {
  children: PropTypes.node.isRequired,
  signout: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isInitialized: PropTypes.bool.isRequired,
};
