import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getDeckSearchTerm } from 'store/selectors/base.selectors';
import { setSearchTerm } from 'store/actions/deck.actions';

import DeckSearch from './deck-search';

const mapStateToProps = createStructuredSelector({
  searchTerm: getDeckSearchTerm,
});

export default connect(
  mapStateToProps,
  { setSearchTerm },
)(DeckSearch);
