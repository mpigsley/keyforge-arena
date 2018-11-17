import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { createStructuredSelector } from 'reselect';

import { getIsLoggedIn } from 'store/selectors/base.selectors';
import { usePrevious } from 'utils/custom-effects';

export default Wrapped => {
  function ProtectedHOC({ isLoggedIn, toHome, ...props }) {
    const prevIsLoggedIn = usePrevious(isLoggedIn);

    useEffect(() => {
      if ((prevIsLoggedIn || prevIsLoggedIn === undefined) && !isLoggedIn) {
        toHome();
      }
    });

    return <Wrapped {...props} />;
  }

  ProtectedHOC.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    toHome: PropTypes.func.isRequired,
  };

  const mapStateToProps = createStructuredSelector({
    isLoggedIn: getIsLoggedIn,
  });

  const mapDispatchToProps = dispatch => ({
    toHome: () => dispatch(push('/')),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ProtectedHOC);
};
