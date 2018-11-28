import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getIsDecksInitialized } from 'store/selectors/base.selectors';

import Dashboard from './dashboard';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsDecksInitialized,
});

export default connect(mapStateToProps)(Dashboard);
