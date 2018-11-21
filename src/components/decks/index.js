import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { createStructuredSelector } from 'reselect';

import { getDecks } from 'store/selectors/base.selectors';

import Decks from './decks';

const mapStateToProps = createStructuredSelector({
  decks: getDecks,
});

const mapDispatchToProps = dispatch => ({
  toDeck: deckId => dispatch(push(`/decks/${deckId}`)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Decks);
