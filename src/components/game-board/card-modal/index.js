import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { cardModal } from 'store/selectors/game.selectors';
import { updateCardModal, handleGameAction } from 'store/actions/game.actions';

import CardModal from './card-modal';

const mapStateToProps = createStructuredSelector({
  cardModal,
});

export default connect(
  mapStateToProps,
  { updateCardModal, handleGameAction },
)(CardModal);
