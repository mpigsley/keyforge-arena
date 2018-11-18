import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getHouseImages } from 'store/selectors/base.selectors';
import { getSortedDecks } from 'store/selectors/deck.selectors';

import DeckList from './deck-list';

const mapStateToProps = createStructuredSelector({
  houseImages: getHouseImages,
  decks: getSortedDecks,
});

export default connect(mapStateToProps)(DeckList);
