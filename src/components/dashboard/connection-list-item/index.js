import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { connectionReply } from 'store/actions/connection.actions';
import { challengeConnection } from 'store/actions/lobby.actions';
import { getIsReplyingTo } from 'store/selectors/base.selectors';

import ConnectionListItem from './connection-list-item';

const mapStateToProps = createStructuredSelector({
  isReplyingTo: getIsReplyingTo,
});

export default connect(
  mapStateToProps,
  { connectionReply, challengeConnection },
)(ConnectionListItem);
