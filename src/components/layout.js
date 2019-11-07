import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

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

  return (
    <>
      {/* Pass in title, description, OG data, etc. */}
      <SEO pageContext={pageContext} />

      <div className="rbio-content-wrap">
        <Header siteTitle="Rocketbelt" />
        <main className={`rbio-content ${pageClass}`}>{children}</main>
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
