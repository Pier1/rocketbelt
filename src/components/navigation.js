import { Link, graphql, useStaticQuery } from 'gatsby';
import React from 'react';

const Navigation = () => {
  const data = useStaticQuery(graphql`
    query {
      allMdx(sort: { order: ASC, fields: [fields___slug] }) {
        edges {
          node {
            fields {
              navLevel1
              navLevel2
              navLevel3
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

  let navData = {
    l1s: [],
  };

  data.allMdx.edges.forEach((edge) => {
    const currentL1 = edge.node.fields.navLevel1;
    const currentL2 = edge.node.fields.navLevel2;
    const currentL3 = edge.node.fields.navLevel3;
    const slug = edge.node.fields.slug;

    const currentLevel = currentL3 ? 3 : currentL2 ? 2 : currentL1 ? 1 : null;

    if (navData.l1s.filter((l1) => l1.name === currentL1).length === 0) {
      navData.l1s.push({
        name: currentL1,
        l2s: [],
        slug: slug
          .split('/')
          .slice(0, 2)
          .join('/'),
      });
    }

    const l1 = navData.l1s.filter((l1) => l1.name === currentL1)[0];

    if (currentLevel !== 1) {
      if (l1.l2s.filter((l2) => l2.name === currentL2).length === 0) {
        l1.l2s.push({
          name: currentL2,
          l3s: [],
          slug: slug
            .split('/')
            .slice(0, 3)
            .join('/'),
        });
      }

      const l2 = l1.l2s.filter((l2) => l2.name === currentL2)[0];

      if (currentLevel !== 2) {
        l2.l3s.push({
          name: currentL3,
          slug: slug
            .split('/')
            .slice(0, 4)
            .join('/'),
        });
      }
    }
  });

  return (
    <nav className="rbio-nav">
      <ul className="rbio-nav_level1">
        {navData.l1s.map((l1) => {
          return (
            <li key={l1.slug} className="rbio-nav_item">
              <Link to={l1.slug}>{l1.name}</Link>
              {l1.l2s.length > 0 &&
                l1.l2s.map((l2) => {
                  return (
                    <ul key={`${l2.slug}_list`} className="rbio-nav_level2">
                      <li key={l2.slug} className="rbio-nav_item">
                        <Link to={l2.slug}>{l2.name}</Link>
                        {l2.l3s.length > 0 &&
                          l2.l3s.map((l3) => {
                            return (
                              <ul
                                key={`${l3.slug}_list`}
                                className="rbio-nav_level3"
                              >
                                <li key={l3.slug} className="rbio-nav_item">
                                  <Link to={l3.slug}>{l3.name}</Link>
                                </li>
                              </ul>
                            );
                          })}
                      </li>
                    </ul>
                  );
                })}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
