import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getSortedDecks } from 'store/selectors/deck.selectors';

import DeckList from './deck-list';

const mapStateToProps = createStructuredSelector({
  decks: getSortedDecks,
});

export default connect(mapStateToProps)(DeckList);
