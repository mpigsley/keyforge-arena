import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classNames from 'classnames';

import Button from 'primitives/button';
import FlexContainer from 'primitives/flex-container';
import Label from 'primitives/label';
import Input from 'primitives/input';
import { X } from 'constants/icons';

import styles from './styles.module.scss';

const LOGIN_PAGE_TYPES = {
  login: 'login',
  signup: 'signup',
  forget: 'forget',
};

ReactModal.setAppElement('#root');

export default function LoginModal({
  isOpen,
  error,
  form,
  signup,
  login,
  googleLogin,
  passwordReset,
  updateLoginForm,
  toggleLoginModal,
}) {
  const [page, setPage] = useState(LOGIN_PAGE_TYPES.login);
  const [isLoggginIn, setIsLoggingIn] = useState(false);
  const { email, password, confirm } = form;

  const onUpdate = key => e => updateLoginForm({ [key]: e.target.value });

  const onConfirm = isGoogle => async () => {
    setIsLoggingIn(true);
    try {
      if (isGoogle) {
        await googleLogin();
      } else if (page === LOGIN_PAGE_TYPES.login) {
        await login();
      } else if (page === LOGIN_PAGE_TYPES.signup) {
        await signup();
      } else {
        await passwordReset();
      }
      setPage(LOGIN_PAGE_TYPES.login);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const submitOnEnter = e => {
    if (e.key === 'Enter') {
      onConfirm()();
    }
  };

  const renderPassword = () => {
    if (page === LOGIN_PAGE_TYPES.forget) {
      return null;
    }
    return (
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onUpdate('password')}
          onKeyPress={submitOnEnter}
        />
      </div>
    );
  };

  const renderForgotPassword = () => {
    if (page !== LOGIN_PAGE_TYPES.login) {
      return null;
    }
    return (
      <div className={styles.forgot}>
        <Button
          minimal
          onKeyPress={submitOnEnter}
          onClick={() => setPage(LOGIN_PAGE_TYPES.forget)}
        >
          Forgot Password?
        </Button>
      </div>
    );
  };

  const renderPasswordConfirm = () => {
    if (page !== LOGIN_PAGE_TYPES.signup) {
      return null;
    }
    return (
      <div>
        <Label htmlFor="confirm">Confirm Password</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          placeholder="Confirm"
          value={confirm}
          onChange={onUpdate('confirm')}
          onKeyPress={submitOnEnter}
        />
      </div>
    );
  };

  const renderError = () => {
    if (!error) {
      return null;
    }
    return (
      <FlexContainer className={styles.error} justify="center">
        {error}
      </FlexContainer>
    );
  };

  let actionText = 'Send Password Reset';
  if (page === LOGIN_PAGE_TYPES.login) {
    actionText = 'Log In';
  } else if (page === LOGIN_PAGE_TYPES.signup) {
    actionText = 'Sign Up';
  }

  return (
    <ReactModal
      contentLabel="Signup & Login"
      isOpen={isOpen}
      onCancel={toggleLoginModal}
      className={styles.modal}
      overlayClassName={styles.overlay}
      ariaHideApp={false}
    >
      <X className={styles.close} onClick={toggleLoginModal} size={30} />
      <FlexContainer justify="center" align="center" direction="column">
        <Button className={styles.google} onClick={onConfirm(true)}>
          Log in with Google
        </Button>
      </FlexContainer>
      <FlexContainer
        className={styles.lineContainer}
        align="center"
        justify="center"
      >
        <span className={styles.line} />
        <span className={styles.or}>or</span>
        <span className={styles.line} />
      </FlexContainer>
      <FlexContainer className={styles.switcher} justify="center">
        <button
          type="submit"
          onClick={() => setPage(LOGIN_PAGE_TYPES.login)}
          className={classNames(styles.switchButton, {
            [styles['switchButton--active']]: page === LOGIN_PAGE_TYPES.login,
          })}
        >
          Log In
        </button>
        <button
          type="submit"
          onClick={() => setPage(LOGIN_PAGE_TYPES.signup)}
          className={classNames(styles.switchButton, {
            [styles['switchButton--active']]: page === LOGIN_PAGE_TYPES.signup,
          })}
        >
          Sign Up
        </button>
      </FlexContainer>
      <FlexContainer
        className={styles.formContainer}
        justify="center"
        direction="column"
      >
        <Label noPadding htmlFor="email">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onUpdate('email')}
          onKeyPress={submitOnEnter}
        />
        {renderPassword()}
        {renderForgotPassword()}
        {renderPasswordConfirm()}
        {renderError()}
        <FlexContainer className={styles.submit} justify="center">
          <Button key="submit" onClick={onConfirm()} isLoading={isLoggginIn}>
            {actionText}
          </Button>
        </FlexContainer>
      </FlexContainer>
    </ReactModal>
  );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  error: PropTypes.string,
  form: PropTypes.shape({
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirm: PropTypes.string.isRequired,
  }).isRequired,
  signup: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  googleLogin: PropTypes.func.isRequired,
  passwordReset: PropTypes.func.isRequired,
  updateLoginForm: PropTypes.func.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
};

LoginModal.defaultProps = {
  error: null,
};
