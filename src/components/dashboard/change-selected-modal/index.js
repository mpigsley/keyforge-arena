import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getSelectedDeck } from 'store/selectors/deck.selectors';

import ChangeSelectedModal from './change-selected-modal';

const mapStateToProps = createStructuredSelector({
  selectedDeck: getSelectedDeck,
});

export default connect(mapStateToProps)(ChangeSelectedModal);
