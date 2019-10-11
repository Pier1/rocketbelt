import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import slugify from '@sindresorhus/slugify';

const H = (props) => {
  let Htag = `span`;

  if (props.level) {
    Htag = `h${props.level}`;
  }

  return (
    <Link
      className="linked-heading"
      to={`${window.location.pathname}#${slugify(props.children)}`}
    >
      <Htag className="rocketbeltio" id={slugify(props.children)} {...props} />
    </Link>
  );
};

H.propTypes = {
  level: PropTypes.number.isRequired,
};

export default H;
