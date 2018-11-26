import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getSelectedDeck,
  getSortedDecks,
} from 'store/selectors/deck.selectors';
import {
  getIsChangeModalOpen,
  getIsChangingSelected,
} from 'store/selectors/base.selectors';
import { changeSelected, toggleChangeModal } from 'store/actions/deck.actions';

import ChangeSelectedModal from './change-selected-modal';

const mapStateToProps = createStructuredSelector({
  isChanging: getIsChangingSelected,
  selectedDeck: getSelectedDeck,
  isOpen: getIsChangeModalOpen,
  decks: getSortedDecks,
});

export default connect(
  mapStateToProps,
  { changeSelected, toggleChangeModal },
)(ChangeSelectedModal);
