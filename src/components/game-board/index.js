import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { endTurn } from 'store/actions/game.actions';
import { gameState, selectedGameStart } from 'store/selectors/game.selectors';
import {
  getIsGameInitialized,
  getGameSequence,
} from 'store/selectors/base.selectors';

import GameBoard from './game-board';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsGameInitialized,
  turnSequence: getGameSequence,
  gameStart: selectedGameStart,
  gameState,
});

const mapDispatchToProps = dispatch => ({
  endTurn: () => dispatch(endTurn()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameBoard);
