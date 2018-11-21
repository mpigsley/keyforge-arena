import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getIsInitialized, getUserForm } from 'store/selectors/base.selectors';

import Profile from './profile';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsInitialized,
  userForm: getUserForm,
});

export default connect(mapStateToProps)(Profile);
