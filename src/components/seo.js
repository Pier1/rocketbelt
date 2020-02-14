/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

// import logo from '../images/rocketbelt-og.jpg';

function SEO({ pageContext, pageMetadata, meta, title }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  const img = {
    lg: `rocketbelt-og-wide.png`,
    sm: `rocketbelt-og.jpg`,
  };

  const seo = {
    description:
      (pageContext && pageContext.frontmatter.description) ||
      site.siteMetadata.description,
    htmlAttrs: { lang: 'en' },
    title: (pageContext && pageContext.frontmatter.title) || title,
    author:
      (pageMetadata && pageMetadata.lastAuthor) || site.siteMetadata.author,
    url:
      typeof window !== `undefined` && pageMetadata
        ? window.location.origin + (pageMetadata && pageMetadata.slug)
        : `https://rocketbelt.io${pageMetadata && pageMetadata.slug}`,
    imagePath: {
      lg: `https://rocketbelt.io/images/${img.lg}`,
      sm: `https://rocketbelt.io/images/${img.sm}`,
    },
  };

  return (
    <Helmet
      htmlAttributes={seo.htmlAttrs}
      title={seo.title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: `description`,
          content: seo.description,
        },
        {
          name: `author`,
          content: seo.author,
        },
        { name: `robots`, content: `index, follow` },
        {
          property: `og:title`,
          content: `${seo.title} | ${site.siteMetadata.title}`,
        },
        {
          property: `og:image`,
          content: `${seo.imagePath.lg}`,
        },
        { property: `og:image:type`, content: 'image/png' },
        { property: `og:image:width`, content: `1200` },
        { property: `og:image:height`, content: `630` },
        {
          property: `og:description`,
          content: seo.description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        { property: `og:url`, content: seo.url },
        { name: 'twitter:image', content: `${seo.imagePath.sm}` },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: seo.author,
        },
        {
          name: `twitter:title`,
          content: `${seo.title} | ${site.siteMetadata.title}`,
        },
        {
          name: `twitter:description`,
          content: seo.description,
        },
      ].concat(meta)}
    ></Helmet>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

export default SEO;
