import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getActiveDeck, getSortedDecks } from 'store/selectors/deck.selectors';
import {
  getIsChangeModalOpen,
  getIsChangingSelected,
} from 'store/selectors/base.selectors';
import { changeSelected, toggleChangeModal } from 'store/actions/deck.actions';

import ChangeSelectedModal from './change-selected-modal';

const mapStateToProps = createStructuredSelector({
  isChanging: getIsChangingSelected,
  activeDeck: getActiveDeck,
  isOpen: getIsChangeModalOpen,
  decks: getSortedDecks,
});

export default connect(
  mapStateToProps,
  { changeSelected, toggleChangeModal },
)(ChangeSelectedModal);
