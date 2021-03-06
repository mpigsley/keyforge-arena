import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getCardImages } from 'store/selectors/base.selectors';

import Card from './card';

const mapStateToProps = createStructuredSelector({
  cardImages: getCardImages,
});

export default connect(mapStateToProps)(Card);
