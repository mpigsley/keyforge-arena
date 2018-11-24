import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getSelectedDeck,
  getSortedDecks,
} from 'store/selectors/deck.selectors';
import { getHouseImages } from 'store/selectors/base.selectors';

import ChangeSelectedModal from './change-selected-modal';

const mapStateToProps = createStructuredSelector({
  selectedDeck: getSelectedDeck,
  houseImages: getHouseImages,
  decks: getSortedDecks,
});

export default connect(mapStateToProps)(ChangeSelectedModal);
