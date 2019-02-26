import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getHouseImages,
  getGameSequence,
} from 'store/selectors/base.selectors';

import GameState from './game-state';

const mapStateToProps = createStructuredSelector({
  turnSequence: getGameSequence,
  houseImages: getHouseImages,
});

export default connect(mapStateToProps)(GameState);
