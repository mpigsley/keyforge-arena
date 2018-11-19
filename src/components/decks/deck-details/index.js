import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getDecks,
  getHouseImages,
  getCardImages,
} from 'store/selectors/base.selectors';
import { removeDeck } from 'store/actions/deck.actions';

import DeckDetails from './deck-details';

const mapStateToProps = createStructuredSelector({
  houseImages: getHouseImages,
  cardImages: getCardImages,
  decks: getDecks,
});

export default connect(
  mapStateToProps,
  { removeDeck },
)(DeckDetails);
