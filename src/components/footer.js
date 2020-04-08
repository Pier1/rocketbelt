import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const footerCss = css`
  grid-area: footer;
  display: flex;
  padding: 1rem;
  background: #e8edf3;
  color: #45474a;
  justify-content: center;
  align-items: center;
  font-size: 0.87rem;
`;

const Footer = () => (
  <footer css={[footerCss]}>
    Rocketbelt was collaboratively assembled at Pier 1 Imports and is
    distributed under an MIT license. 🚀 © {new Date().getFullYear()} Pier 1
    Imports.
  </footer>
);

export default Footer;
