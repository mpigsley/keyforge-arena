import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import classNames from 'classnames';

import Button from 'primitives/button';
import FlexContainer from 'primitives/flex-container';
import Label from 'primitives/label';
import Input from 'primitives/input';
import { X } from 'constants/icons';
import { useTextInput } from 'utils/custom-effects';

import styles from './styles.module.scss';

const LOGIN_PAGE_TYPES = {
  login: 'login',
  signup: 'signup',
  forget: 'forget',
};

ReactModal.setAppElement('#root');

export default function LoginModal({
  isOpen,
  onClose,
  googleLogin,
  signup,
  login,
  passwordReset,
  error,
}) {
  const [page, setPage] = useState(LOGIN_PAGE_TYPES.login);
  const [isLoggginIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useTextInput();
  const [password, setPassword] = useTextInput();
  const [confirm, setConfirm] = useTextInput();

  const onConfirm = async () => {
    setIsLoggingIn(true);
    try {
      if (page === LOGIN_PAGE_TYPES.login) {
        await login({ email, password });
      } else if (page === LOGIN_PAGE_TYPES.signup) {
        await signup({ email, password, confirm });
      } else {
        await passwordReset({ email });
      }
      onClose();
      setIsLoggingIn(false);
      setPage(LOGIN_PAGE_TYPES.login);
      setEmail();
      setPassword();
      setConfirm();
    } catch (e) {
      setIsLoggingIn(false);
    }
  };

  const submitOnEnter = e => {
    if (e.key === 'Enter') {
      onConfirm();
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
          onChange={setPassword}
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
          onChange={setConfirm}
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
      onCancel={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
      ariaHideApp={false}
    >
      <X className={styles.close} onClick={onClose} size={30} />
      <FlexContainer justify="center" align="center" direction="column">
        <Button className={styles.google} onClick={googleLogin}>
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
          onChange={setEmail}
          onKeyPress={submitOnEnter}
        />
        {renderPassword()}
        {renderForgotPassword()}
        {renderPasswordConfirm()}
        {renderError()}
        <FlexContainer className={styles.submit} justify="center">
          <Button key="submit" onClick={onConfirm} isLoading={isLoggginIn}>
            {actionText}
          </Button>
        </FlexContainer>
      </FlexContainer>
    </ReactModal>
  );
}

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  googleLogin: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  passwordReset: PropTypes.func.isRequired,
  error: PropTypes.string,
};

LoginModal.defaultProps = {
  error: null,
};