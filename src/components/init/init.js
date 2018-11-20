import { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Init({ children, initializeApp }) {
  useEffect(() => {
    initializeApp();
  }, []);

  return children;
}

Init.propTypes = {
  children: PropTypes.node.isRequired,
  initializeApp: PropTypes.func.isRequired,
};
