import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getIsInitialized,
  getUserForm,
  getUserTag,
} from 'store/selectors/base.selectors';
import { updateForm, updateUser } from 'store/actions/session.actions';

import Profile from './profile';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsInitialized,
  userForm: getUserForm,
  userTag: getUserTag,
});

export default connect(
  mapStateToProps,
  { updateForm, updateUser },
)(Profile);
