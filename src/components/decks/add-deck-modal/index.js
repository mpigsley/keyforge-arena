import { connect } from 'react-redux';

import { submitNewDeck } from 'store/actions/deck.actions';

import AddDeckModal from './add-deck-modal';

export default connect(
  undefined,
  { submitNewDeck },
)(AddDeckModal);
