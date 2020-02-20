import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Navigation from './navigation';

/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as styles from './header.styles';

const Header = ({ siteTitle }) => (
  <header css={styles.headerCss} className="rbio-header">
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
