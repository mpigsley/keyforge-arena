import { connect } from 'react-redux';

import { handleGameAction } from 'store/actions/game.actions';
import { PLAY_CREATURE } from 'constants/game-action-types';

import Battleline from './battleline';

const mapDispatchToProps = dispatch => ({
  playCreature: key =>
    dispatch(handleGameAction(PLAY_CREATURE, { key, isLeftFlank: true })),
});

export default connect(
  undefined,
  mapDispatchToProps,
)(Battleline);
