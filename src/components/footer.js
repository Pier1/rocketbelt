import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { fontSize } from '../utils/rocketbelt';
import meatball from '../images/meatball.svg';

const footerCss = css`
  position: relative;
  left: 50%;
  display: flex;
  padding: 2rem 1rem;
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
        flex-direction: column;
        align-items: center;
      `}
    >
      <div className="footer_text">
        Rocketbelt was collaboratively assembled at Pier 1 Imports and is
        distributed under an MIT license. 🚀 © {new Date().getFullYear()} Pier 1
        Imports.
      </div>
      <div
        className="footer_logo"
        css={css`
          margin-top: 1rem;
        `}
      >
        <a href="https://www.pier1.com/">
          <img src={meatball} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
