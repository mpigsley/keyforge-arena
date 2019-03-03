import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { startDrag } from 'store/actions/game.actions';
import { getGameSequence } from 'store/selectors/base.selectors';
import { playerHouse } from 'store/selectors/game.selectors';

import Hand from './hand';

const mapStateToProps = createStructuredSelector({
  turnSequence: getGameSequence,
  playerHouse,
});

export default connect(
  mapStateToProps,
  { startDrag },
)(Hand);
