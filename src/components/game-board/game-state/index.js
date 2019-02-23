import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getHouseImages } from 'store/selectors/base.selectors';
import { turnSequenceText } from 'store/selectors/game.selectors';

import GameState from './game-state';

const mapStateToProps = createStructuredSelector({
  houseImages: getHouseImages,
  turnSequenceText,
});

export default connect(mapStateToProps)(GameState);
