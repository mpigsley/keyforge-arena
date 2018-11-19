import { connect } from 'react-redux';

import { initialize } from 'store/actions/combined.actions';

import Init from './init';

export default connect(
  null,
  { initialize },
)(Init);
