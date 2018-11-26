import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getIsInitialized } from 'store/selectors/base.selectors';

import GameBoard from './game-board';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsInitialized,
});

export default connect(mapStateToProps)(GameBoard);
