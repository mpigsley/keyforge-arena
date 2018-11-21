import React from 'react';
import PropTypes from 'prop-types';

import Navigation from 'components/navigation';
import Label from 'primitives/label';
import Input from 'primitives/input';
import Button from 'primitives/button';

import styles from './styles.module.scss';

export default function Profile({ isInitialized, userForm, updateUserForm }) {
  if (!isInitialized) {
    return null;
  }
  return (
    <Navigation>
      <div className={styles.container}>
        <h1>Edit Profile</h1>
        <p>Friends can find you by your email or username and tag.</p>
        <div className={styles.inputRow}>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" disabled value={userForm.email} />
        </div>
        <div className={styles.inputRow}>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={userForm.username}
            onChange={e => updateUserForm(e.target.value)}
          />
        </div>
        <Button className={styles.btn}>Update Profile</Button>
      </div>
    </Navigation>
  );
}

Profile.propTypes = {
  isInitialized: PropTypes.bool.isRequired,
  updateUserForm: PropTypes.func.isRequired,
  userForm: PropTypes.shape({
    email: PropTypes.string.isRequired,
    username: PropTypes.string,
  }),
};

Profile.defaultProps = {
  userForm: undefined,
};
