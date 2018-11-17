import { connect } from 'react-redux';

import { submitNewDeck } from 'store/actions/deck.actions';

import Decks from './decks';

export default connect(
  undefined,
  { submitNewDeck },
)(Decks);
