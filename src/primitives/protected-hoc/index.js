import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { createStructuredSelector } from 'reselect';

import {
  getIsLoggedIn,
  getIsInitialized,
} from 'store/selectors/base.selectors';
import { usePrevious } from 'utils/effects';

export default Wrapped => {
  function ProtectedHOC({ isLoggedIn, isInitialized, toHome, ...props }) {
    const prevIsLoggedIn = usePrevious(isLoggedIn);
    const prevIsInitialized = usePrevious(isInitialized);

    useEffect(() => {
      const didSignOut = prevIsLoggedIn && !isLoggedIn;
      const initializedWithoutAuth =
        !prevIsInitialized && isInitialized && !isLoggedIn;
      if (didSignOut || initializedWithoutAuth) {
        toHome();
      }
    });

    return <Wrapped {...props} />;
  }

  ProtectedHOC.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    isInitialized: PropTypes.bool.isRequired,
    toHome: PropTypes.func.isRequired,
  };

  const mapStateToProps = createStructuredSelector({
    isLoggedIn: getIsLoggedIn,
    isInitialized: getIsInitialized,
  });

  const mapDispatchToProps = dispatch => ({
    toHome: () => dispatch(push('/')),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ProtectedHOC);
};
