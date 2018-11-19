import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { signout } from 'store/actions/session.actions';
import { getIsLoggedIn } from 'store/selectors/base.selectors';

import Navigation from './navigation';

const mapStateToProps = createStructuredSelector({
  isLoggedIn: getIsLoggedIn,
});

export default connect(
  mapStateToProps,
  { signout },
)(Navigation);
