import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { isDraggedArtifact, playerHouse } from 'store/selectors/game.selectors';
import { handleGameAction } from 'store/actions/game.actions';
import { PLAY_ARTIFACT } from 'constants/game-action-types';

import Artifacts from './artifacts';

const mapStateToProps = createStructuredSelector({
  isDraggedArtifact,
  playerHouse,
});

const mapDispatchToProps = dispatch => ({
  playArtifact: key => dispatch(handleGameAction(PLAY_ARTIFACT, { key })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Artifacts);
