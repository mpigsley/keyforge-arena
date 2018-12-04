import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getDecks } from 'store/selectors/base.selectors';
import { fetchCardImages } from 'store/actions/image.actions';
import { hasGameLoaded } from 'store/selectors/game.selectors';

import GameBoard from './game-board';

const mapStateToProps = createStructuredSelector({
  hasLoaded: hasGameLoaded,
  decks: getDecks,
});

export default connect(
  mapStateToProps,
  { fetchCardImages },
)(GameBoard);
