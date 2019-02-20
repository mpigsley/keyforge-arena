import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getSelectedDeck } from 'store/selectors/base.selectors';
import { getSortedDecks } from 'store/selectors/deck.selectors';

import DeckList from './deck-list';

const mapStateToProps = createStructuredSelector({
  selected: getSelectedDeck,
  decks: getSortedDecks,
});

export default connect(mapStateToProps)(DeckList);
