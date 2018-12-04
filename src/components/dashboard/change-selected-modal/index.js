import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { activeDeck, getSortedDecks } from 'store/selectors/deck.selectors';
import {
  getIsChangeModalOpen,
  getIsChangingSelected,
} from 'store/selectors/base.selectors';
import { changeSelected, toggleChangeModal } from 'store/actions/deck.actions';

import ChangeSelectedModal from './change-selected-modal';

const mapStateToProps = createStructuredSelector({
  isChanging: getIsChangingSelected,
  isOpen: getIsChangeModalOpen,
  decks: getSortedDecks,
  activeDeck,
});

export default connect(
  mapStateToProps,
  { changeSelected, toggleChangeModal },
)(ChangeSelectedModal);
