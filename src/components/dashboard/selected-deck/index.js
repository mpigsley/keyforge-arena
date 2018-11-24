import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getSelectedDeck } from 'store/selectors/deck.selectors';

import SelectedDeck from './selected-deck';

const mapStateToProps = createStructuredSelector({
  selectedDeck: getSelectedDeck,
});

export default connect(mapStateToProps)(SelectedDeck);
