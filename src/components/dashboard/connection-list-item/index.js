import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { connectionReply } from 'store/actions/connection.actions';
import {
  challengeConnection,
  cancelChallenge,
  acceptChallenge,
} from 'store/actions/lobby.actions';
import {
  getDecks,
  getIsReplyingTo,
  getIsCancellingChallenge,
  getIsAcceptingChallenge,
} from 'store/selectors/base.selectors';

import ConnectionListItem from './connection-list-item';

const mapStateToProps = createStructuredSelector({
  isCancelling: getIsCancellingChallenge,
  isAccepting: getIsAcceptingChallenge,
  isReplyingTo: getIsReplyingTo,
  decks: getDecks,
});

export default connect(
  mapStateToProps,
  { connectionReply, challengeConnection, cancelChallenge, acceptChallenge },
)(ConnectionListItem);
