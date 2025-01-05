import React from 'react';
import PropTypes from 'prop-types';

import './Card.css';

const Card = (props) => {
  const classes = 'card ' + props.className;

  return <div className={classes}>{props.children}</div>;
};

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Card;