import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Navigation from 'components/navigation';
import FlexContainer from 'primitives/flex-container';
import Label from 'primitives/label';
import Input from 'primitives/input';
import Button from 'primitives/button';

import styles from './styles.module.scss';

export default function Profile({
  isInitialized,
  userForm,
  updateUserForm,
  updateProfile,
  userTag,
  userId,
  error,
}) {
  const [didUpdate, setDidUpdate] = useState(false);

  const onUpdateForm = key => e => {
    if (didUpdate) {
      setDidUpdate(false);
    }
    updateUserForm({ [key]: e.target.value });
  };

  const onUpdate = () => updateProfile(userId, userForm);

  let message;
  if (error) {
    message = <div className={styles.error}>{error}</div>;
  } else if (didUpdate) {
    message = <div>Profile updated successfully.</div>;
  }

  let tagHash;
  if (userTag) {
    tagHash = <span className={styles.tag}>(#{userTag})</span>;
  }

  let profile;
  if (isInitialized) {
    profile = (
      <>
        <p>Other users can find you by your email or username and tag.</p>
        <div className={styles.inputRow}>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" disabled value={userForm.email} />
        </div>
        <div className={styles.inputRow}>
          <Label htmlFor="username">Username {tagHash}</Label>
          <Input
            id="username"
            name="username"
            value={userForm.username}
            onChange={onUpdateForm('username')}
          />
        </div>
        <FlexContainer align="center">
          <Button className={styles.btn} onClick={onUpdate}>
            Update Profile
          </Button>
          {message}
        </FlexContainer>
      </>
    );
  }

  return (
    <Navigation>
      <div className={styles.container}>
        <h1>Edit Profile</h1>
        {profile}
      </div>
    </Navigation>
  );
}

Profile.propTypes = {
  isInitialized: PropTypes.bool.isRequired,
  updateUserForm: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  userForm: PropTypes.shape({
    email: PropTypes.string,
    username: PropTypes.string,
  }),
  userId: PropTypes.string,
  userTag: PropTypes.string,
  error: PropTypes.string,
};

Profile.defaultProps = {
  userForm: undefined,
  userTag: undefined,
  userId: undefined,
  error: null,
};
