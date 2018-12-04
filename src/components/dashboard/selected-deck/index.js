import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { activeDeck } from 'store/selectors/deck.selectors';
import { toggleChangeModal } from 'store/actions/deck.actions';

import SelectedDeck from './selected-deck';

const mapStateToProps = createStructuredSelector({ activeDeck });

export default connect(
  mapStateToProps,
  { toggleChangeModal },
)(SelectedDeck);
