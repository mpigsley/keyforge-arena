import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getHouseImages } from 'store/selectors/base.selectors';

import GameState from './game-state';

const mapStateToProps = createStructuredSelector({
  houseImages: getHouseImages,
});

export default connect(mapStateToProps)(GameState);
