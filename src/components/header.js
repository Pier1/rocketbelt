import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import Navigation from './navigation';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { cx } from 'emotion';

import { colors, media } from '../utils/rocketbelt';

const headerCss = css`
  background: white;
  border-bottom: 3px solid ${colors.brand.prussianBlue};
  min-height: 44px;
  box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.08);
  position: fixed;
  padding: 0 0.25rem;
  width: 100%;

  ${media[0]} {
    border: 3px solid ${colors.brand.prussianBlue};
    padding: 0 1rem;
    width: calc(100% - 8rem);
    max-width: calc(1024px - 8rem);
    margin: 2rem auto 0 auto;
  }

  @media screen and (min-width: 480px) {
    left: 0;
    right: 0;

    &::before {
      content: '';
      height: 2rem;
      position: fixed;
      padding: 0 1rem;
      left: -3px;
      right: -3px;
      top: calc(-2rem - 3px);
      background-image: linear-gradient(
        180deg,
        #ffffff 0%,
        rgba(255, 255, 255, 0.98) 17%,
        rgba(255, 255, 255, 0.95) 31%,
        rgba(255, 255, 255, 0.9) 43%,
        rgba(255, 255, 255, 0.85) 54%,
        rgba(255, 255, 255, 0.79) 63%,
        rgba(255, 255, 255, 0.73) 72%,
        rgba(255, 255, 255, 0.65) 81%,
        rgba(255, 255, 255, 0.58) 90%,
        rgba(255, 255, 255, 0.5) 100%
      );
    }
  }
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
