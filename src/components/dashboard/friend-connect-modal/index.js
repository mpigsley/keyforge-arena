import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getUserId } from 'store/selectors/base.selectors';

import FriendConnectModal from './friend-connect-modal';

const mapStateToProps = createStructuredSelector({
  userId: getUserId,
});

export default connect(mapStateToProps)(FriendConnectModal);
