import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  hasGameLoaded,
  getPlayerState,
  getOpponentState,
  selectedGameStart,
} from 'store/selectors/game.selectors';

import GameBoard from './game-board';

const mapStateToProps = createStructuredSelector({
  playerState: getPlayerState,
  opponentState: getOpponentState,
  hasLoaded: hasGameLoaded,
  gameStart: selectedGameStart,
});

export default connect(mapStateToProps)(GameBoard);
