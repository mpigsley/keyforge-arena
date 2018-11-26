import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getAuthError,
  getIsLoginModalOpen,
  getLoginForm,
  getIsLoggingIn,
} from 'store/selectors/base.selectors';
import {
  authenticate,
  passwordReset,
  updateLoginForm,
  toggleLoginModal,
} from 'store/actions/session.actions';

import LoginModal from './login-modal';

const mapStateToProps = createStructuredSelector({
  isOpen: getIsLoginModalOpen,
  isLoggingIn: getIsLoggingIn,
  error: getAuthError,
  form: getLoginForm,
});

export default connect(
  mapStateToProps,
  {
    authenticate,
    passwordReset,
    updateLoginForm,
    toggleLoginModal,
  },
)(LoginModal);
