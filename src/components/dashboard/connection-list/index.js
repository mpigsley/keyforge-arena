import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getAreConnectionsInitialized } from 'store/selectors/base.selectors';
import { getSortedConnections } from 'store/selectors/connection.selectors';

import ConnectionList from './connection-list';

const mapStateToProps = createStructuredSelector({
  isInitialized: getAreConnectionsInitialized,
  connections: getSortedConnections,
});

export default connect(mapStateToProps)(ConnectionList);
