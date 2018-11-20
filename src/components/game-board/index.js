import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { initializeGame } from 'store/actions/combined.actions';
import { getIsInitialized } from 'store/selectors/base.selectors';

import GameBoard from './game-board';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsInitialized,
});

export default connect(
  mapStateToProps,
  { initializeGame },
)(GameBoard);
