import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage = () => {
  const edges = useStaticQuery(graphql`
    query  {
      allFile(filter: {name: {regex: "/^404-\\d+?/i"}}) {
        edges {
          node {
            name
            relativePath
          }
        }
      }
    }
  `).allFile.edges;

  const randomSrc =
    edges[Math.floor(Math.random() * edges.length)].node.relativePath;

  return (
    <Layout>
      <SEO title="404: Page Not Found" />
      <h1>Page Not Found</h1>
      <video width="100%" autoPlay loop muted>
        <source src={`/images/${randomSrc}`} type="video/mp4" />
      </video>
    </Layout>
  );
};

export default NotFoundPage;
