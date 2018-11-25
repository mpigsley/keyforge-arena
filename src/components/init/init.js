import React, { useEffect } from 'react';
import ReduxToastr from 'react-redux-toastr';
import PropTypes from 'prop-types';

export default function Init({ children, initializeApp }) {
  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <>
      {children}
      <ReduxToastr position="bottom-left" newestOnTop={false} progressBar />
    </>
  );
}

Init.propTypes = {
  children: PropTypes.node.isRequired,
  initializeApp: PropTypes.func.isRequired,
};
