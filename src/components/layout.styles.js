import { css } from '@emotion/core';
import { media, fontSize, colors } from '../utils/rocketbelt';

export const wrapCss = css`
  h1,
  h2,
  h3 {
    text-transform: none;
    font-family: Tomorrow;
  }

  h2,
  h3 {
    font-weight: 400;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    &.linked-heading_heading {
      display: inline-block;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
  }

  h1 {
    font-weight: 300;

    &.linked-heading_heading {
      margin-top: 0;
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
      }
    }
  }

  h3 {
    &.linked-heading_heading {
      margin-top: 0.5em;
      font-size: ${fontSize(1)};

      ${media[0]} {
        font-size: ${fontSize(2)};
      }
    }
  }

  .linked-heading_anchor {
    line-height: 1;
  }

  .footnote-ref {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.25em;
    width: 1.25em;
    height: 1.25em;
    border-radius: 50%;
    background: ${colors
      .chroma(colors.gray.plus1)
      .brighten()
      .css()};
    font-weight: 600;
    font-size: ${fontSize(-2)};
  }

  .footnotes {
    padding-top: 1rem;
    border-top: 1px solid color(gray, plus3);

    &::before {
      display: block;
      color: color(gray, minus1);
      content: 'Notes';
      font-style: font-style(italic);
      font-size: font-size(1);
      font-family: font-family(serif);
    }

    .target,
    :target {
      background: rgba(color(warning), 0.6);
    }

    hr {
      display: none;
      visibility: hidden;
    }

    ol {
      display: inline-flex;
      flex-direction: column;
      margin: 0;
      padding-left: 0;
    }

    li {
      display: inline-block;
      margin-bottom: 0.5rem;
      background: transparent;
      counter-increment: FN-ITEMS;
      transition: background 300ms linear;
    }

    li::before {
      padding-right: 0.25em;
      content: counter(FN-ITEMS) '.';
    }

    .footnote-backref {
      margin-left: 0.5rem;
    }
  }

  blockquote {
    margin: 0;
    padding: 2rem;
    border-left: 0.5rem solid ${colors.brand.columbiaBlue};
    background: ${colors
      .chroma(colors.brand.catskillBlue)
      .brighten(0.25)
      .css()};
    font-size: ${fontSize(2)};

    p:last-of-type {
      margin-bottom: 0;
    }

    cite {
      display: block;
      text-align: right;
      font-size: ${fontSize(0)};
    }
  }
`;

export const mainCss = css`
  grid-area: main;
`;

export const mainWrapCss = css`
  margin: auto;
  padding: 1rem;

  max-width: calc(1200px - var(--nav-desktop-width));
  height: 100%;

  ${media[0]} {
    padding: 2rem;
    padding-top: 1rem;
  }

  ${media[1]} {
    margin-top: 0;
    padding: 2rem;
    padding-top: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 24px rgba(0, 0, 0, 0.08);
  }
`;
