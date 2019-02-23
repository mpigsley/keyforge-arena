import { connect } from 'react-redux';

import { updateCardModal } from 'store/actions/game.actions';

import CardPiles from './card-piles';

export default connect(
  undefined,
  { updateCardModal },
)(CardPiles);
