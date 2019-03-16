import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  isDraggedCreature,
  isDraggedUpgrade,
  playerHouse,
} from 'store/selectors/game.selectors';
import { handleGameAction } from 'store/actions/game.actions';
import { PLAY_CREATURE, PLAY_UPGRADE } from 'constants/game-action-types';

import Battleline from './battleline';

const mapStateToProps = createStructuredSelector({
  isDraggedCreature,
  isDraggedUpgrade,
  playerHouse,
});

const mapDispatchToProps = dispatch => ({
  playCreature: (key, isLeftFlank) =>
    dispatch(handleGameAction(PLAY_CREATURE, { key, isLeftFlank })),
  playUpgrade: (key, creature) =>
    dispatch(handleGameAction(PLAY_UPGRADE, { key, creature })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Battleline);
