import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Navigation from './navigation';

import logo from '../images/rocketbelt.svg';
import kebab from '../images/kebab.svg';

const toggleNav = () => {
  document.querySelector('.rbio-header').classList.toggle('rbio-nav-open');
};

const Header = ({ siteTitle }) => (
  <header className="rbio-header">
    <button
      onClick={toggleNav}
      className="rbio-nav-trigger button button-minimal"
    >
      <img src={kebab} className="rbio-nav-trigger_image" />
    </button>
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
