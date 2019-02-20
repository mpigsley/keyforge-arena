import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  hasGameLoaded,
  selectedGameStart,
  getGameDeckDetails,
} from 'store/selectors/game.selectors';

import GameBoard from './game-board';

const mapStateToProps = createStructuredSelector({
  deckDetails: getGameDeckDetails,
  hasLoaded: hasGameLoaded,
  gameStart: selectedGameStart,
});

export default connect(mapStateToProps)(GameBoard);
