import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Navigation from './navigation';

import logo from '../images/rocketbelt.svg';

const Header = ({ siteTitle }) => (
  <header className="rbio-header">
    <Link className="rbio-link" to="/">
    <img src={logo} className="rbio-logo" />
      <span className="rbio-title">Rocketbelt</span>
    </Link>
    <Navigation />
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
