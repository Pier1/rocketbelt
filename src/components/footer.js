import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const Footer = () => (
  <footer className="rbio-footer">
    © {new Date().getFullYear()} Pier 1 Imports. Rocketbelt is distributed under
    an MIT license. 🚀
  </footer>
);

export default Footer;
