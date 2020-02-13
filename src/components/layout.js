import React, { useEffect, useState } from 'react';
import PropTypes, { node } from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { cx } from 'emotion';

import { media, fontSize } from '../utils/rocketbelt';

const { addScript } = require('../utils/addScript.js');
import jQuery from 'jquery';
import '../rocketbelt/base/rocketbelt';

import 'normalize.css';
import '../rocketbelt/rocketbelt.scss';
import '../styles/site.scss';

import SEO from './seo';
import Header from './header';
import Footer from './footer';

import InjectedScript from './injected-script';

let pageClass = '';
let pageMetadata = {};

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
  const edges = useStaticQuery(graphql`
    query {
      allMdx {
        edges {
          node {
            fields {
              slug
              navLevel1
              navLevel2
              navLevel3
              lastAuthorTime
              lastAuthor
            }
          }
        }
      }
    }
  `).allMdx.edges;

  if (typeof window !== `undefined`) {
    pageMetadata = edges.filter((e) => {
      return (
        window.location.pathname.replace(/\/$/i, '') === e.node.fields.slug
      );
    })[0] || { node: { fields: {} } };
  } else {
    pageMetadata = { node: { fields: {} } };
  }

  const [injectedScript, setInjectedScript] = useState('');

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
          setInjectedScript(child.props.children.props.children);
        }
      });
  });

  const hasScriptTags =
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
    max-width: 1024px;
    margin: auto;
    background: white;
    padding: 1rem;
    padding-top: 2rem;
    height: 100%;
    margin-top: 2rem;

    ${media[0]} {
      margin-top: 0;
      padding: 4rem;
      padding-top: 6rem;
    }
  `;

  return (
    <>
      {/* Pass in title, description, OG data, etc. */}
      <SEO pageContext={pageContext} pageMetadata={pageMetadata.node.fields} />
      <div className="rbio-content-wrap" css={wrapCss}>
        <Header siteTitle="Rocketbelt" />
        <main css={mainCss} className={`rbio-content ${pageClass}`}>
          <div css={mainWrapCss}>{children}</div>
        </main>
        <Footer />
      </div>
      {hasScriptTags &&
        pageContext.frontmatter.scriptTags.forEach((script) => {
          addScript(`/scripts/${script}`);
        })}
      {injectedScript !== '' && <InjectedScript script={injectedScript} />}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
