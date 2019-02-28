import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getIsHandlingAction } from 'store/selectors/base.selectors';
import { cardModal } from 'store/selectors/game.selectors';
import { updateCardModal, handleGameAction } from 'store/actions/game.actions';

import CardModal from './card-modal';

const mapStateToProps = createStructuredSelector({
  isHandlingAction: getIsHandlingAction,
  cardModal,
});

export default connect(
  mapStateToProps,
  { updateCardModal, handleGameAction },
)(CardModal);
