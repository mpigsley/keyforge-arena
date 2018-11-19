import { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Init({ children, initialize }) {
  useEffect(() => {
    initialize();
  }, []);

  return children;
}

Init.propTypes = {
  children: PropTypes.node.isRequired,
  initialize: PropTypes.func.isRequired,
};
