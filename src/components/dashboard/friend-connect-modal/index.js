import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getUserId,
  getIsRequesting,
  getIsConnectModalOpen,
  getConnectionError,
} from 'store/selectors/base.selectors';
import {
  requestConnection,
  unsetError,
  toggleConnectModal,
} from 'store/actions/connection.actions';

import FriendConnectModal from './friend-connect-modal';

const mapStateToProps = createStructuredSelector({
  userId: getUserId,
  isRequesting: getIsRequesting,
  isOpen: getIsConnectModalOpen,
  error: getConnectionError,
});

export default connect(
  mapStateToProps,
  { requestConnection, unsetError, onClose: toggleConnectModal },
)(FriendConnectModal);
