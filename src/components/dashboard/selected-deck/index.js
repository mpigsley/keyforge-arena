import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getSelectedDeck } from 'store/selectors/deck.selectors';
import { getHouseImages } from 'store/selectors/base.selectors';

import SelectedDeck from './selected-deck';

const mapStateToProps = createStructuredSelector({
  selectedDeck: getSelectedDeck,
  houseImages: getHouseImages,
});

export default connect(mapStateToProps)(SelectedDeck);
