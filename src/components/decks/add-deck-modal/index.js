import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getIsSubmittingDeck,
  getIsSubmitModalOpen,
  getDeckError,
} from 'store/selectors/base.selectors';
import { submitNewDeck, toggleSubmitModal } from 'store/actions/deck.actions';

import AddDeckModal from './add-deck-modal';

const mapStateToProps = createStructuredSelector({
  isSubmitting: getIsSubmittingDeck,
  isOpen: getIsSubmitModalOpen,
  error: getDeckError,
});

export default connect(
  mapStateToProps,
  { submitNewDeck, toggleSubmitModal },
)(AddDeckModal);
