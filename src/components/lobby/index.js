import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { createStructuredSelector } from 'reselect';

import { getCurrentLobby } from 'store/selectors/base.selectors';
import { cancelChallenge } from 'store/actions/lobby.actions';

import Lobby from './lobby';

const mapStateToProps = createStructuredSelector({
  currentLobby: getCurrentLobby,
});

const mapDispatchToProps = dispatch => ({
  toHome: () => dispatch(push('/dashboard')),
  cancelChallenge: currentLobby => dispatch(cancelChallenge(currentLobby)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Lobby);
