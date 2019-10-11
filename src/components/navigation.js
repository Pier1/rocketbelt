import { Link, graphql, useStaticQuery } from 'gatsby';
import React from 'react';

const Navigation = () => {
  const data = useStaticQuery(graphql`
    query {
      allMdx(sort: { order: ASC, fields: [fields___slug] }) {
        edges {
          node {
            fields {
              # level1category
              # level2category
              slug
            }
            headings {
              depth
              value
            }
          }
        }
      }
    }
  `);

  return (
    <nav>
      <ul>
        {data.allMdx.edges.map((edge) => {
          const mdxH1 =
            edge.node.headings && edge.node.headings.length > 0
              ? edge.node.headings.filter((h) => h.depth === 1)[0].value
              : 'ADD AN H1';
          // const text = edge.fields.subdir === '' ? edge.fields.topLevelDir :
          return (
            <li key={edge.node.fields.slug}>
              <Link to={edge.node.fields.slug}>{mdxH1}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
