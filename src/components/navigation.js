import { Link, graphql, useStaticQuery } from 'gatsby';
import React, { useState, useEffect } from 'react';

/** @jsx jsx */
import { jsx } from '@emotion/core';
const classNames = require('classnames');

import RbIcon from './rb-icon';
import * as styles from './navigation.styles';

const Navigation = () => {
  const [activeL1, setActiveL1] = useState({ name: '', slug: '', l2s: [] });
  const [activeL2, setActiveL2] = useState({ name: '', slug: '', l3s: [] });
  const [activeL3, setActiveL3] = useState({ name: '', slug: '' });

  const [navOpen, setNavOpen] = useState({ l1: false, l2: false, l3: false });

  const openNavAtLevel = (navLevel) => {
    Object.keys(navOpen).forEach((level) => {
      if (level !== navLevel) {
        navOpen[level] = false;
      }
    });

    navOpen[navLevel] = !navOpen[navLevel];

    const updatedNav = Object.assign({}, navOpen);
    setNavOpen(updatedNav);
  };

  const closeNavAtLevel = (navLevel, e, that) => {
    const el = e.currentTarget;
    const sib = el.nextElementSibling;

    if (!sib.classList || !sib.classList.contains('rbio-nav_dropdown-open')) {
      navOpen[navLevel] = false;
    }

    const updatedNav = Object.assign({}, navOpen);
    setNavOpen(updatedNav);
  };

  useEffect(() => {
    const path = location.pathname.split('/');

    const l1Slug = '/' + path.slice(1, 2);
    const l1 = navData.l1s.filter((l1) => {
      return l1.slug === l1Slug;
    })[0];

    if (l1) {
      setActiveL1({ name: l1.name, slug: l1.slug, l2s: l1.l2s });

      const l2Slug = '/' + path.slice(1, 3).join('/');
      const l2 = l1.l2s.filter((l2) => {
        return l2.slug === l2Slug;
      })[0];

      if (l2) {
        setActiveL2({
          name: l2.name,
          slug: l2.slug,
          l3s: l2.l3s || [],
        });

        const l3Slug = '/' + path.slice(1, 4).join('/');
        const l3 = l2.l3s.filter((l3) => {
          return l3.slug === l3Slug;
        })[0];

        if (l3) {
          setActiveL3({
            name: l3.name,
            slug: l3.slug,
          });
        } else {
          setActiveL3({ name: '', slug: '' });
        }
      } else {
        setActiveL2({ name: '', slug: '' });
      }
    } else {
      setActiveL1({ name: '', slug: '' });
    }

    // const l1El = document.querySelector('.rbio-nav .nav_l1');
    // const l2El = document.querySelector('.rbio-nav .nav_l2');
    // const l3El = document.querySelector('.rbio-nav .nav_l3');
    // console.dir(l1El, l2El, l3El);
    // const offscreen = {
    //   l2: l2El && window.rb.distanceOffscreen(l2El),
    //   l3: l3El && window.rb.distanceOffscreen(l3El),
    // };

    // if (offscreen.l3 && offscreen.l3.right < 0) {
    //   l1El.classList.add('nav_title_condensed');
    // }
  }, []);

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
    <nav className="rbio-nav" css={styles.navCss}>
      <div css={styles.navWrapperCss}>
        <Link to="/" css={styles.homeLinkCss}>
          <span className="site-title">Rocketbelt</span>
        </Link>
      </div>
      <span css={styles.navIconCss}>
        <RbIcon icon="chevron-right" />
      </span>
      <div css={styles.navWrapperCss} className="nav_l1">
        <button
          // onMouseEnter={() => {
          //   openNavAtLevel('l1');
          // }}
          // onMouseLeave={(e) => {
          //   closeNavAtLevel('l1', e, this);
          // }}
          onClick={() => {
            openNavAtLevel('l1');
          }}
          className={`rbio-nav_button ${
            !!navOpen.l1 ? 'rbio-nav_dropdown-open' : ''
          }`}
        >
          <span css={styles.navIconCss}>
            {activeL1.name === '' ? (
              <RbIcon icon="more-horz" />
            ) : (
              <span
                className="nav_title_wrapper"
                css={styles.navTitleWrapperCss}
              >
                <span className="nav_title_text">{activeL1.name}</span>
                <RbIcon className="nav_title_placeholder" icon="more-horz" />
              </span>
            )}
          </span>
        </button>
        <ul
          className={classNames('rbio-nav_dropdown', {
            'rbio-nav_dropdown-open': navOpen.l1,
          })}
        >
          {navData.l1s.map((l1) => {
            return (
              <li
                key={l1.slug}
                className={classNames('rbio-nav_level1_item', 'rbio-nav_item', {
                  active: activeL1.name === l1.name,
                })}
              >
                <Link to={l1.slug} className="rbio-nav_link">
                  <span className="link_text">{l1.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {activeL1 && activeL1.l2s && activeL1.l2s.length > 0 && (
        <>
          <span css={styles.navIconCss}>
            <RbIcon icon="chevron-right" />
          </span>

          <div css={styles.navWrapperCss} className="nav_l2">
            <button
              onClick={() => {
                openNavAtLevel('l2');
              }}
              className="rbio-nav_button"
            >
              <span css={styles.navIconCss}>
                {activeL2.name === '' ? (
                  <RbIcon icon="more-horz" />
                ) : (
                  <span
                    className="nav_title_wrapper"
                    css={styles.navTitleWrapperCss}
                  >
                    <span className="nav_title_text">{activeL2.name}</span>
                    <RbIcon
                      className="nav_title_placeholder"
                      icon="more-horz"
                    />
                  </span>
                )}
              </span>
            </button>
            <ul
              className={classNames('rbio-nav_dropdown', {
                'rbio-nav_dropdown-open': navOpen.l2,
              })}
            >
              {activeL1.l2s.map((l2) => {
                return (
                  <li
                    key={l2.slug}
                    className={classNames(
                      'rbio-nav_level2_item',
                      'rbio-nav_item',
                      {
                        active: activeL2.slug === l2.slug,
                      }
                    )}
                  >
                    <Link to={l2.slug} className="rbio-nav_link">
                      <span className="link_text">{l2.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}

      {activeL2 && activeL2.l3s && activeL2.l3s.length > 0 && (
        <>
          <span css={styles.navIconCss}>
            <RbIcon icon="chevron-right" />
          </span>
          <div css={styles.navWrapperCss} className="nav_l3">
            <button
              onClick={() => {
                openNavAtLevel('l3');
              }}
              className="rbio-nav_button"
            >
              <span css={styles.navIconCss}>
                {activeL3.name === '' ? (
                  <RbIcon icon="more-horz" />
                ) : (
                  activeL3.name
                )}
              </span>
            </button>
            <ul
              className={classNames('rbio-nav_dropdown', {
                'rbio-nav_dropdown-open': navOpen.l3,
              })}
            >
              {activeL2 &&
                activeL2.l3s &&
                activeL2.l3s.length > 0 &&
                activeL2.l3s.map((l3) => {
                  return (
                    <li
                      key={l3.slug}
                      className={classNames(
                        'rbio-nav_level3_item',
                        'rbio-nav_item',
                        {
                          active: activeL3.slug === l3.slug,
                        }
                      )}
                    >
                      <Link to={l3.slug} className="rbio-nav_link">
                        <span className="link_text">{l3.name}</span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navigation;
