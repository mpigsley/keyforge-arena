import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getDecks,
  getIsDecksInitialized,
} from 'store/selectors/base.selectors';
import { fetchCardImages } from 'store/actions/image.actions';

import GameBoard from './game-board';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsDecksInitialized,
  decks: getDecks,
});

export default connect(
  mapStateToProps,
  { fetchCardImages },
)(GameBoard);
