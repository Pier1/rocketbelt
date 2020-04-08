import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

/** @jsx jsx */
import { jsx, css, Global } from '@emotion/core';
import cx from 'emotion';

import { media } from '../utils/rocketbelt';

import * as styles from './layout.styles';

const { addScript } = require('../utils/addScript.js');
import jQuery from 'jquery';
import '../rocketbelt/base/rocketbelt';

import 'normalize.css';
import '../rocketbelt/rocketbelt.scss';
import '../styles/site.scss';

import SEO from './seo';
import Header from './header';
import Navigation from './navigation';
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

  const addHeaderScrollHandler = () => {
    const header = document.querySelector('header');
    let headerHeight = header.offsetHeight;
    let delta = headerHeight * 1.5;
    let lastScrollTop = headerHeight;

    let footerVisible = false;

    window.addEventListener('rb.optimizedScroll', function(e) {
      let scrollTop = e.target.scrollY;

      if (Math.abs(lastScrollTop - scrollTop) <= delta) {
        return;
      }

      // Cache scroll position & start timer. If scroll position > delta when timer fires, hide
      if (!header.classList || !header.classList.contains('header-hidden')) {
        setTimeout(() => {
          if (window.scrollY - lastScrollTop > 30 && !footerVisible) {
            header.classList.add('header-hidden');
          }
        }, 100);
      } else {
        setTimeout(() => {
          if (window.scrollY - lastScrollTop < -30 || window.scrollY < delta) {
            header.classList.remove('header-hidden');
          }
        }, 100);
      }

      lastScrollTop = scrollTop;
    });
  };

  useEffect(() => {
    addScrollListeners();
    addHeaderScrollHandler();

    document.querySelector('body').classList.remove('scroll-locked');

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

  const globalCss = css`
    :root {
      --mobile-padding-base: 0.5rem;
      --nav-desktop-width: 300px;

      --touchable: 44px;

      --header-mobile-height: var(--touchable);
      --header-desktop-height: var(--header-mobile-height);

      --nav-padding-base: 1.5rem;

      ${media[2]} {
        --nav-padding-base: 1.25rem;
      }
    }

    .scroll-locked {
      overflow: hidden;
    }
  `;

  return (
    <>
      {/* Pass in title, description, OG data, etc. */}
      <SEO pageContext={pageContext} pageMetadata={pageMetadata.node.fields} />
      <Global styles={globalCss} />
      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        <div
          className="rbio-content-wrap"
          css={[
            styles.wrapCss,
            css`
              display: grid;
              max-width: 1200px;
              grid-template-areas:
                'header'
                'nav'
                'main'
                'footer';

              ${media[2]} {
                grid-template-columns: var(--nav-desktop-width) 1fr;
                grid-template-areas:
                  'header header'
                  'nav main'
                  'footer footer';
              }
            `,
          ]}
        >
          <Header />
          <Navigation />
          <main css={styles.mainCss} className={`rbio-content ${pageClass}`}>
            <div
              css={[
                styles.mainWrapCss,
                css`
                  /* TODO: A better way to do this… */
                  background: ${pageContext ? 'white' : 'transparent'};
                `,
              ]}
            >
              {children}
            </div>
          </main>
          <Footer />
        </div>
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
