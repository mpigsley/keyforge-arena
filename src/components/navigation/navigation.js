import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import FlexContainer from 'primitives/flex-container';
import LoginModal from 'components/login-modal';

import styles from './styles.module.scss';

export default function Navigation({
  children,
  initialize,
  signout,
  isLoggedIn,
}) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  useEffect(() => {
    initialize();
  }, []);

  const renderProtectedLink = link => (isLoggedIn ? link : null);

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
                <span className={styles.keyforgeText}>Keyforge</span> Arena
              </FlexContainer>
            </Link>
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
                {isLoggedIn ? 'Sign Out' : 'Log In'}
              </button>
            </FlexContainer>
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
  initialize: PropTypes.func.isRequired,
  signout: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
