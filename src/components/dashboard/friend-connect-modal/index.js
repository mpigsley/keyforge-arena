import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getUserId } from 'store/selectors/base.selectors';
import { requestConnection } from 'store/actions/connection.actions';

import FriendConnectModal from './friend-connect-modal';

const mapStateToProps = createStructuredSelector({
  userId: getUserId,
});

export default connect(
  mapStateToProps,
  { requestConnection },
)(FriendConnectModal);
