import React from 'react';
import PropTypes from 'prop-types';

const PublicRoute = ({ component: Component, ...rest }) => {
  return <Component {...rest} />;
};

PublicRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

export default PublicRoute;
