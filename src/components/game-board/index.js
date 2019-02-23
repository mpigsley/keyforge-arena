import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  hasGameLoaded,
  playerState,
  opponentState,
  selectedGameStart,
} from 'store/selectors/game.selectors';

import GameBoard from './game-board';

const mapStateToProps = createStructuredSelector({
  gameStart: selectedGameStart,
  hasLoaded: hasGameLoaded,
  playerState,
  opponentState,
});

export default connect(mapStateToProps)(GameBoard);
