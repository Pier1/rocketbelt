import { css } from '@emotion/core';
import RbLogo from '../images/rocketbelt.svg';
import { media, colors } from '../utils/rocketbelt';

export const navWrapperCss = css`
  overflow: hidden;
  min-width: 44px;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.nav_l1,
  &.nav_l2,
  &.nav_l3 {
    &.nav_title_condensed {
      .nav_title_placeholder {
        display: inherit;
        visibility: visible;
      }
    }

    & .nav_title_placeholder {
      display: none;
      visibility: hidden;
    }
  }

  & .rbio-nav_button {
    /* stylelint-disable declaration-no-important */
    display: flex;
    padding: 0 0.25rem !important;
    min-height: 36px;
    width: 100%;
    height: auto !important;
    border: 0 !important;
    color: #000 !important;
    align-items: center;
    justify-content: center;

    &:hover {
      background: transparent !important;
      box-shadow: none !important;
    }
    /* stylelint-enable */
  }

  & .rbio-nav_dropdown {
    position: absolute;
    display: none;
    visibility: hidden;
    margin: 0;
    padding: 0;
    background: #fff;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
    list-style-type: none;

    &.rbio-nav_dropdown-open {
      display: block;
      visibility: visible;
    }

    & .rbio-nav_link {
      display: flex;
      padding: 0.5rem 1rem;
      min-height: 2rem;
      color: #000;
      align-items: center;
      white-space: nowrap;

      & .link_text {
        position: relative;

        &::after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          border-bottom: 3px solid transparent;
          content: '';
          transition: border-color 100ms linear;
        }
      }

      &:hover .link_text::after {
        border-color: #ced9e5;
      }
    }

    & .active {
      .rbio-nav_link .link_text::after {
        border-color: #0033a0;
      }
    }
  }
`;

export const navIconCss = css`
  display: flex;
  align-items: center;
`;

export const navCss = css`
  display: flex;
  align-items: center;

  & .icon {
    width: 1rem;
    height: 1rem;
    color: #000;
  }
`;

export const navTitleWrapperCss = css`
  display: inline-flex;
  align-items: center;
`;

export const homeLinkCss = css`
  display: flex;
  min-width: 44px;
  height: 44px;
  background: url(${RbLogo});
  background-position: center;
  background-size: 28px;
  background-repeat: no-repeat;

  & .site-title {
    display: none;
    visibility: hidden;
    margin-right: 0.5rem;
    margin-left: 44px;
  }

  ${media[2]} {
    display: flex;
    background-position: left center;
    align-items: center;

    & .site-title {
      display: inline;
      visibility: visible;
      color: ${colors.brand.prussianBlue};
      text-transform: uppercase;
      letter-spacing: 1.4px;
      font-weight: bold;
    }
  }
`;
