import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { isDraggedCreature, playerHouse } from 'store/selectors/game.selectors';
import { handleGameAction } from 'store/actions/game.actions';
import { PLAY_CREATURE } from 'constants/game-action-types';

import Battleline from './battleline';

const mapStateToProps = createStructuredSelector({
  isDraggedCreature,
  playerHouse,
});

const mapDispatchToProps = dispatch => ({
  playCreature: (key, isLeftFlank) =>
    dispatch(handleGameAction(PLAY_CREATURE, { key, isLeftFlank })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Battleline);
