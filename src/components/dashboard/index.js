import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getIsInitialized } from 'store/selectors/base.selectors';

import Dashboard from './dashboard';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsInitialized,
});

export default connect(mapStateToProps)(Dashboard);
