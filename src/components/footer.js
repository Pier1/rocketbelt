import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { fontSize } from '../utils/rocketbelt';

const footerCss = css`
  position: relative;
  left: 50%;
  display: flex;
  padding: 1rem;
  width: 100vw;
  background: #e8edf3;
  color: #45474a;
  font-size: ${fontSize(-1)};
  transform: translateX(-50%);
  grid-area: footer;
  justify-content: center;
  align-items: center;
`;

const Footer = () => (
  <footer css={[footerCss]}>
    <div
      className="header-footer_wrap"
      css={css`
        display: flex;
        justify-content: center;
      `}
    >
      Rocketbelt was collaboratively assembled at Pier 1 Imports and is
      distributed under an MIT license. 🚀 © {new Date().getFullYear()} Pier 1
      Imports.
    </div>
  </footer>
);

export default Footer;
