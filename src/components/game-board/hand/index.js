import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getGameSequence } from 'store/selectors/base.selectors';

import Hand from './hand';

const mapStateToProps = createStructuredSelector({
  turnSequence: getGameSequence,
});

export default connect(mapStateToProps)(Hand);
