import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getAuthError } from 'store/selectors/base.selectors';
import {
  googleLogin,
  signup,
  login,
  passwordReset,
} from 'store/actions/session.actions';

import LoginModal from './login-modal';

const mapStateToProps = createStructuredSelector({
  error: getAuthError,
});

export default connect(
  mapStateToProps,
  {
    googleLogin,
    signup,
    login,
    passwordReset,
  },
)(LoginModal);
