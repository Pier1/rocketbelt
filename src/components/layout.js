/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

import Helmet from 'react-helmet';
import 'normalize.css';
import '../rocketbelt/rocketbelt.scss';
import '../styles/site.scss';

import SEO from './seo';
import Header from './header';

const Layout = ({ children, pageContext }) => {
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

  let scripts = [];

  if (hasScripts) {
    scripts = pageContext.frontmatter.scriptTags.map((script) => {
      return {
        src: script,
        defer: true,
        async: true,
      };
    });
  }

  return (
    <>
      {/* Pass in title, description, OG data, etc. */}
      <SEO pageContext={pageContext} />
      <Helmet script={scripts} />
      <div className="rbio-content-wrap">
        <Header siteTitle={data.site.siteMetadata.title} />
        <main className="rbio-content">{children}</main>
        <footer>© {new Date().getFullYear()} Pier 1 Imports.</footer>
      </div>
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
