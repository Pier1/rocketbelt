import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

const { addScript } = require('../utils/addScript.js');
import 'jquery';
import '../rocketbelt/scripts/rocketbelt';

import 'normalize.css';
import '../rocketbelt/rocketbelt.scss';
import '../styles/site.scss';

import SEO from './seo';
import Header from './header';
import Footer from './footer';

const Layout = ({ children, pageContext }) => {
  useEffect(() => {
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

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const hasScripts =
    pageContext &&
    pageContext.frontmatter &&
    pageContext.frontmatter.scriptTags &&
    pageContext.frontmatter.scriptTags.length > 0;

  const pageClass = window.location.href.split('/').slice(-1)[0];

  return (
    <>
      {/* Pass in title, description, OG data, etc. */}
      <SEO pageContext={pageContext} />

      <div className="rbio-content-wrap">
        <Header siteTitle={data.site.siteMetadata.title} />
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
