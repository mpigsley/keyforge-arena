import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  hasGameLoaded,
  gameState,
  selectedGameStart,
} from 'store/selectors/game.selectors';

import GameBoard from './game-board';

const mapStateToProps = createStructuredSelector({
  gameStart: selectedGameStart,
  hasLoaded: hasGameLoaded,
  gameState,
});

export default connect(mapStateToProps)(GameBoard);
