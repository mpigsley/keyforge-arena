import { connect } from 'react-redux';

import { submitNewDeck } from 'store/actions/deck.actions';

import MyDecks from './my-decks';

export default connect(
  undefined,
  { submitNewDeck },
)(MyDecks);
