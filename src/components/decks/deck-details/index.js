import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getDecks } from 'store/selectors/base.selectors';

import DeckDetails from './deck-details';

const mapStateToProps = createStructuredSelector({
  decks: getDecks,
});

export default connect(mapStateToProps)(DeckDetails);
