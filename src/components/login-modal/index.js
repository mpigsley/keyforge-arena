import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getAuthError,
  getIsLoginModalOpen,
  getLoginForm,
} from 'store/selectors/base.selectors';
import {
  signup,
  login,
  googleLogin,
  passwordReset,
  updateLoginForm,
  toggleLoginModal,
} from 'store/actions/session.actions';

import LoginModal from './login-modal';

const mapStateToProps = createStructuredSelector({
  isOpen: getIsLoginModalOpen,
  error: getAuthError,
  form: getLoginForm,
});

export default connect(
  mapStateToProps,
  {
    signup,
    login,
    googleLogin,
    passwordReset,
    updateLoginForm,
    toggleLoginModal,
  },
)(LoginModal);
