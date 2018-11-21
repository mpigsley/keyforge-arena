import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { signout } from 'store/actions/session.actions';
import {
  getIsLoggedIn,
  getIsInitialized,
} from 'store/selectors/base.selectors';

import Navigation from './navigation';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsInitialized,
  isLoggedIn: getIsLoggedIn,
});

export default connect(
  mapStateToProps,
  { signout },
)(Navigation);
