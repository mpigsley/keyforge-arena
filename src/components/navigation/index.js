import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { signout, toggleLoginModal } from 'store/actions/user.actions';
import {
  getUser,
  getIsLoggedIn,
  getIsInitialized,
} from 'store/selectors/base.selectors';

import Navigation from './navigation';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsInitialized,
  isLoggedIn: getIsLoggedIn,
  user: getUser,
});

export default connect(
  mapStateToProps,
  { signout, toggleLoginModal },
)(Navigation);
