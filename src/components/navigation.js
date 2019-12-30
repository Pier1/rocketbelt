import { Link, graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import RbIcon from './rb-icon';
import PropTypes from 'prop-types';

const createNavDataObject = (edgeNode) => {
  let data = {
    level: edgeNode.fields.navLevel3 ? 3 : edgeNode.fields.navLevel2 ? 2 : edgeNode.fields.navLevel1 ? 1 : null,
    name: edgeNode.fields.navLevel3 || edgeNode.fields.navLevel2 || edgeNode.fields.navLevel1,
    slug: edgeNode.fields.slug
  };
  data.parent = data.level > 1 ? edgeNode.fields[`navLevel${data.level - 1}`] : null;
  data.children = data.level < 3 ? [] : null;
  data.slugSimple = data.slug.toLowerCase().slice(1).replace(/\//gi, '_');
  return data;
};

const sortNavPriority = (edgeA, edgeB) => {
  let aPriority = edgeA.node.frontmatter.navPriority || 500,
      bPriority = edgeB.node.frontmatter.navPriority || 500;
  return (aPriority === bPriority ? 0 : (aPriority < bPriority ? -1 : 1));
};

const Navigation = (props) => {
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
            frontmatter {
              navPriority
            }
          }
        }
      }
    }
  `);

  let navData = {
    l1s: [],
    all: [],
    mapping: {}
  };

  data.allMdx.edges.sort(sortNavPriority).forEach(function(edge){
    let edgeData = createNavDataObject(edge.node);
    edgeData.level === 1 && navData.l1s.push(edgeData);
    navData.all.push(edgeData);
    navData.mapping[edgeData.name] = edgeData;
  });

  navData.all.forEach(function(datum) {
    datum.level > 1 && navData.mapping[datum.parent].children.push(datum);
  });
  
  const toggleNav = () => {
    document.querySelector('.rbio-header').classList.toggle('rbio-nav-open');
  };

  return (
    <nav className={props.className}>
      <ul className="rbio-nav_list">
        <li className="rbio-nav_close-button">
          <button
            className="button button-minimal"
            onClick={toggleNav}
            aria-label="Close Navigation"
          >
            <RbIcon icon="close" />
          </button>
        </li>
        {navData.l1s.map((l1, index) => {
          return (
            <li key={`${index}_${l1.slug}`} className="rbio-nav_level1 rbio-nav_level" data-page={`${l1.slugSimple}`}>
              <ul
                key={`${index}_${l1.slug}_list`}
                className="rbio-nav_level1_items rbio-nav_items"
              >
                <li className="rbio-nav_level1_item rbio-nav_item" data-page={`${l1.slugSimple}`}>
                  <Link to={l1.slug}>{l1.name}</Link>
                </li>
                {l1.children.length > 0 &&
                  l1.children.map((l2, index) => {
                    return (
                      <li
                        key={`${index}_${l2.slug}_list`}
                        className="rbio-nav_level2 rbio-nav_level"
                        data-page={`${l2.slugSimple}`}
                      >
                        <ul
                          key={`${index}_${l2.slug}`}
                          className="rbio-nav_level2_items rbio-nav_items"
                        >
                          <li className="rbio-nav_level2_item rbio-nav_item" data-page={`${l2.slugSimple}`}>
                            <Link to={l2.slug}>{l2.name}</Link>
                          </li>

                          {l2.children.length > 0 && (
                            <li className="rbio-nav_level3_items rbio-nav_items">
                              <ul>
                                {l2.children.map((l3, index) => {
                                  return (
                                    <li
                                      key={`${index}_list`} 
                                      className="rbio-nav_level3_item rbio-nav_item" 
                                      data-page={`${l3.slugSimple}`}
                                    >
                                      <Link to={l3.slug}>{l3.name}</Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          )}
                        </ul>
                      </li>
                    );
                  })}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

Navigation.propTypes = {
  className: PropTypes.string,
};

Navigation.defaultProps = {
  className: `rbio-nav`,
};


export default Navigation;
