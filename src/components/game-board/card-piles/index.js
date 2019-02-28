import { connect } from 'react-redux';

import { updateCardModal, handleGameAction } from 'store/actions/game.actions';
import { DISCARD_CARD } from 'constants/game-action-types';

import CardPiles from './card-piles';

const mapDispatchToProps = dispatch => ({
  discardCard: key => dispatch(handleGameAction(DISCARD_CARD, { key })),
  updateCardModal: key => dispatch(updateCardModal(key)),
});

export default connect(
  undefined,
  mapDispatchToProps,
)(CardPiles);
