import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getHouseImages } from 'store/selectors/base.selectors';

import HouseIcons from './house-icons';

const mapStateToProps = createStructuredSelector({
  houseImages: getHouseImages,
});

export default connect(mapStateToProps)(HouseIcons);
