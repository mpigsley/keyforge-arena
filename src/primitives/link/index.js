import React from 'react';
import PropTypes from 'prop-types';

export default function Link({ to, children, inNewTab, ...props }) {
  let additional = {};
  if (inNewTab) {
    additional = { target: '_blank', rel: 'noopener noreferrer' };
  }
  return (
    <a {...props} {...additional} href={to}>
      {children}
    </a>
  );
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  inNewTab: PropTypes.bool,
};

Link.defaultProps = {
  inNewTab: false,
};
