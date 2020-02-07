import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const footerCss = css`
  display: flex;
  padding: 1rem;
  background: #e8edf3;
  color: #45474a;
  justify-content: center;
  align-items: center;
  font-size: 0.87rem;
`;

const Footer = () => (
  <footer className="rbio-footer" css={footerCss}>
    © {new Date().getFullYear()} Pier 1 Imports. Rocketbelt is distributed under
    an MIT license. 🚀
  </footer>
);

export default Footer;
