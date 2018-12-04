import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getDecks,
  getHouseImages,
  getSelectedDeck,
  getIsDecksInitialized,
} from 'store/selectors/base.selectors';
import { deleteDeck, toggleSubmitModal } from 'store/actions/deck.actions';
import { fetchCardImages } from 'store/actions/image.actions';

import DeckDetails from './deck-details';

const mapStateToProps = createStructuredSelector({
  isInitialized: getIsDecksInitialized,
  houseImages: getHouseImages,
  selected: getSelectedDeck,
  decks: getDecks,
});

export default connect(
  mapStateToProps,
  { deleteDeck, fetchCardImages, toggleSubmitModal },
)(DeckDetails);
