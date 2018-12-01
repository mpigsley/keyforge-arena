import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { connectionReply } from 'store/actions/connection.actions';
import {
  challengeConnection,
  cancelChallenge,
} from 'store/actions/lobby.actions';
import {
  getIsReplyingTo,
  getIsCancellingChallenge,
} from 'store/selectors/base.selectors';

import ConnectionListItem from './connection-list-item';

const mapStateToProps = createStructuredSelector({
  isCancelling: getIsCancellingChallenge,
  isReplyingTo: getIsReplyingTo,
});

export default connect(
  mapStateToProps,
  { connectionReply, challengeConnection, cancelChallenge },
)(ConnectionListItem);
