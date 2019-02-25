import React from 'react';
import PropTypes from 'prop-types';
import ReduxToastr from 'react-redux-toastr';

export default function Wrapper({ children }) {
  return (
    <>
      {children}
      <ReduxToastr position="bottom-left" newestOnTop={false} progressBar />
    </>
  );
}

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
