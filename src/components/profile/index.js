import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getIsInitialized,
  getUserError,
  getUserForm,
  getUserTag,
  getUserId,
} from 'store/selectors/base.selectors';
import { updateUserForm, updateProfile } from 'store/actions/user.actions';

import Profile from './profile';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsInitialized,
  userForm: getUserForm,
  error: getUserError,
  userTag: getUserTag,
  userId: getUserId,
});

const mapDispatchToProps = dispatch => ({
  updateUserForm: update => dispatch(updateUserForm(update)),
  updateProfile: (userId, form) => dispatch(updateProfile(userId, form)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
