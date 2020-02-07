import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { cx } from 'emotion';

// import { color, media } from './rocketbelt.js';
const breakpoints = [480, 768, 992, 1200];
const media = breakpoints.map((bp) => `@media (min-width: ${bp}px)`);

const ms = require('modularscale-js');

const fontSize = (step) => {
  return `${(ms(step, { base: [15, 13], ratio: 1.333 }) / 15).toFixed(2)}rem`;
};

const { addScript } = require('../utils/addScript.js');
import jQuery from 'jquery';
import '../rocketbelt/base/rocketbelt';

import 'normalize.css';
import '../rocketbelt/rocketbelt.scss';
import '../styles/site.scss';

import SEO from './seo';
import Header from './header';
import Footer from './footer';

let pageClass = '';

if (typeof window !== `undefined`) {
  window.$ = window.jQuery = jQuery;

  require('smooth-scroll')('a[href*="#"', {
    header: '.rbio-header',
    speed: 250,
    easing: 'easeInOutQuad',
  });
}

const addScrollListeners = () => {
  document.addEventListener('scrollStart', (e) => {
    if (
      e.detail.toggle &&
      e.detail.toggle.classList &&
      e.detail.toggle.classList.contains('footnote-backref')
    ) {
      document.querySelectorAll('.footnotes .target').forEach((target) => {
        target.classList.remove('target');
      });
    }
  });

  document.addEventListener('scrollStop', (e) => {
    if (
      e.detail.toggle &&
      e.detail.toggle.classList &&
      e.detail.toggle.classList.contains('footnote-ref')
    ) {
      e.detail.anchor.classList.add('target');
    }
  });
};

const Layout = ({ children, pageContext }) => {
  useEffect(() => {
    addScrollListeners();

    const hash = window.location.hash;
    const el = hash !== '' ? document.querySelector(`${hash}`) : null;
    if (el) {
      el.scrollIntoView();
    }

    children.length > 0 &&
      children.forEach((child) => {
        if (
          child.props &&
          child.props.children &&
          child.props.children.props &&
          child.props.children.props.className &&
          child.props.children.props.className.indexOf('language-js') > -1 &&
          child.props.children.props['run-on-load']
        ) {
          eval(child.props.children.props.children);
        }
      });
  });

  const hasScripts =
    pageContext &&
    pageContext.frontmatter &&
    pageContext.frontmatter.scriptTags &&
    pageContext.frontmatter.scriptTags.length > 0;

  if (typeof window !== `undefined`) {
    pageClass = window.location.pathname
      .replace(/\/$/, '')
      .split('/')
      .slice(-1)[0];
  }

  const wrapCss = css`
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
        font-size: ${fontSize(2)};
        line-height: 1.2;

        ${media[0]} {
          font-size: ${fontSize(3)};
        }
      }
    }

    h3 {
      &.linked-heading_heading {
        font-size: ${fontSize(2)};
        line-height: 1.2;
      }
    }
  `;

  const mainCss = css`
    background: #efefef;
  `;

  const mainWrapCss = css`
    max-width: 990px;
    margin: auto;
    background: white;
    padding: 1rem;
    height: 100%;
    margin-top: 2rem;

    ${media[0]} {
      margin-top: 0;
      padding: 4rem;
    }
  `;

  return (
    <>
      {/* Pass in title, description, OG data, etc. */}
      <SEO pageContext={pageContext} />
      <div className="rbio-content-wrap" css={wrapCss}>
        <Header siteTitle="Rocketbelt" />
        <main css={mainCss} className={`rbio-content ${pageClass}`}>
          <div css={mainWrapCss}>{children}</div>
        </main>
        <Footer />
      </div>
      {hasScripts &&
        pageContext.frontmatter.scriptTags.forEach((script) => {
          addScript(`/scripts/${script}`);
        })}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

// export const query = graphql`
//   query ScriptTagQuery($mdxId: String) {
//     mdx(id: {eq: $mdxId}) {
//       frontmatter {
//         scriptTags
//       }
//     }
//   }
// `;

export default Layout;
