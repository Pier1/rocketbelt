import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Navigation from './navigation';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { cx } from 'emotion';

import logo from '../images/rocketbelt.svg';
import kebab from '../images/kebab.svg';

const toggleNav = () => {
  document.querySelector('.rbio-header').classList.toggle('rbio-nav-open');
};

const headerCss = css`
  background: white;
  min-height: 44px;
  box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 1rem;
  left: 1rem;
`;

const Header = ({ siteTitle }) => (
  <header css={headerCss} className="rbio-header">
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
