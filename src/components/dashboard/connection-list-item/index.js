import { connect } from 'react-redux';

import { connectionReply } from 'store/actions/connection.actions';

import ConnectionListItem from './connection-list-item';

export default connect(
  undefined,
  { connectionReply },
)(ConnectionListItem);
