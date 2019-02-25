import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { gameState, selectedGameStart } from 'store/selectors/game.selectors';
import { getIsGameInitialized } from 'store/selectors/base.selectors';

import GameBoard from './game-board';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsGameInitialized,
  gameStart: selectedGameStart,
  gameState,
});

export default connect(mapStateToProps)(GameBoard);
