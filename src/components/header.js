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
    <div className="rbio-header-inner">
      <button
        onClick={toggleNav}
        className="rbio-nav-trigger button button-minimal"
      >
        <img src={kebab} className="rbio-nav-trigger_image" />
      </button>
      <Link className="rbio-link" to="/">
        <img src={logo} className="rbio-logo" />
        <span className="rbio-title">Rocketbelt</span>
      </Link>
      <Navigation className="rbio-nav"/>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
