import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import hamburger from '../images/hamburger.svg';
import logo from '../images/rb-logo-white.svg';
import { media, fontSize, colors, ease } from '../utils/rocketbelt';

const Header = ({ siteTitle }) => {
  return (
    <header
      css={[
        css`
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          min-height: var(--header-mobile-height);
          background: ${colors.brand.prussianBlue};
          transition: transform 300ms ${ease.in};
          transform: translateY(0);
          align-items: center;
          grid-area: header;

          &.header-hidden {
            transform: translateY(-100%);
          }

          ${media[2]} {
            position: relative;
            left: 50%;
            display: flex;
            /* padding: var(--nav-padding-base); */
            width: 100vw;
            height: calc(var(--header-mobile-height) * 1.25);
            transition: none;
            transform: translateX(-50%);
            justify-content: center;

            &.header-hidden {
              position: relative;
              transform: translateX(-50%);
            }
          }
        `,
      ]}
    >
      <div
        className="header-footer_wrap"
        css={css`
          display: flex;
          align-items: center;
          padding: var(--mobile-padding-base);

          button,
          a {
            :focus {
              outline-color: #fff !important;
              outline-offset: 4px;
            }
          }

          ${media[2]} {
            padding: calc(var(--nav-padding-base) / 1.33)
              var(--nav-padding-base);
          }
        `}
      >
        <button
          className="button-minimal button"
          onClick={() => {
            const nav = document.querySelector('nav');
            const body = document.querySelector('body');

            nav.classList.toggle('nav-hidden');
            body.classList.toggle('scroll-locked');
          }}
          css={css`
            width: calc(var(--touchable-lg) + var(--mobile-padding-base));
            height: calc(var(--touchable-lg) - 2 * var(--mobile-padding-base));

            ${media[2]} {
              display: none;
              visibility: hidden;
            }
          `}
        >
          <div
            css={css`
              &,
              img {
                display: inline-block;
                height: 100%;
              }
            `}
          >
            <img src={hamburger} />
          </div>
        </button>

        <Link
          to="/"
          css={css`
            display: inline-flex;
            height: 100%;
            text-transform: lowercase;
            font-weight: 400;
            font-size: ${fontSize(4)};
            font-family: Tomorrow;
            align-items: center;
          `}
        >
          <img
            src={logo}
            css={css`
              display: none;
              visibility: hidden;
              height: 100%;

              ${media[2]} {
                display: inline-block;
                visibility: visible;
              }
            `}
          />
          <span
            css={css`
              margin-left: var(--mobile-padding-base);
              color: white;
            `}
          >
            Rocketbelt
          </span>
        </Link>
      </div>
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
