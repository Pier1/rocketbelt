import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import slugify from '@sindresorhus/slugify';

const H = (props) => {
  let Htag = `span`;

  if (props.level) {
    Htag = `h${props.level}`;
  }

  // Prevent "JavaScript" from slugging as "java-script" because that's just
  // silly.
  const toSlug = props.children.replace('JavaScript', 'Javascript');

  return (
    <span className="linked-heading">
      <Htag
        className="rbio linked-heading_heading"
        id={slugify(toSlug)}
        {...props}
      />
      <Link
        className="linked-heading_anchor"
        to={`${window.location.pathname}#${slugify(toSlug)}`}
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
