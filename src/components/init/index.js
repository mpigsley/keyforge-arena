import { connect } from 'react-redux';

import { initializeApp } from 'store/actions/session.actions';

import Init from './init';

export default connect(
  null,
  { initializeApp },
)(Init);
