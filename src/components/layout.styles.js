import { css } from '@emotion/core';
import { media, fontSize, colors } from '../utils/rocketbelt';

export const wrapCss = css`
  h1 {
    &.linked-heading_heading {
      font-size: ${fontSize(4)};

      ${media[0]} {
        font-size: ${fontSize(6)};
      }

      ${media[1]} {
        font-size: ${fontSize(8)};
      }
    }
  }

  h2 {
    &.linked-heading_heading {
      font-size: ${fontSize(1)};

      ${media[0]} {
        font-size: ${fontSize(2)};
      }

      ${media[1]} {
        font-size: ${fontSize(3)};
        line-height: 1.2;
      }
    }
  }

  h3 {
    &.linked-heading_heading {
      font-size: ${fontSize(1)};

      ${media[0]} {
        font-size: ${fontSize(2)};
      }

      ${media[1]} {
        line-height: 1.2;
      }
    }
  }

  .linked-heading_anchor {
    line-height: 1;
  }
`;

export const mainCss = css`
  background: ${colors
    .chroma(colors.gray.plus2)
    .alpha(0.5)
    .css()};
`;

export const mainWrapCss = css`
  margin: auto;
  margin-top: 0;
  padding: 1rem;
  padding-top: 2rem;
  max-width: 1024px;
  height: 100%;
  background: transparent;

  ${media[0]} {
    margin-top: 0;
    padding: 4rem;
    padding-top: 6rem;
  }
`;
