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
    <span className={`linked-heading rbio-h${props.level}`}>
      <Htag
        className="rbio linked-heading_heading"
        id={slugify(props.children)}
        {...props}
      />
      <Link
        className="linked-heading_anchor"
        to={`${window.location.pathname}#${slugify(props.children)}`}
      >
        #
      </Link>
    </span>
  );
};

H.propTypes = {
  level: PropTypes.number.isRequired,
};

export default H;
