import { Link, graphql, useStaticQuery } from 'gatsby';
import React, { useState, useEffect } from 'react';

/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { cx } from 'emotion';

import { media, colors, fontSize, ease } from '../utils/rocketbelt';

const Navigation = () => {
  const [activeL1, setActiveL1] = useState({});
  const [activeL2, setActiveL2] = useState({});
  const [activeL3, setActiveL3] = useState({});

  useEffect(() => {
    const path = location.pathname.split('/');
    const l1Slug = '/' + path.slice(1, 2);

    const l1 = navData.l1s.filter((l1) => {
      return l1.slug === l1Slug;
    })[0];

    if (l1) {
      setActiveL1(l1);

      const l2Slug = '/' + path.slice(1, 3).join('/');
      const l2 = l1.l2s.filter((l2) => {
        return l2.slug === l2Slug;
      })[0];

      if (l2) {
        setActiveL2(l2);

        const l3Slug = '/' + path.slice(1, 4).join('/');
        const l3 = l2.l3s.filter((l3) => {
          return l3.slug === l3Slug;
        })[0];

        if (l3) {
          setActiveL3(l3);
        } else {
          setActiveL3({});
        }
      } else {
        setActiveL2({});
      }
    } else {
      setActiveL1({});
    }
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
    <nav
      className="nav-hidden"
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        z-index: 11;
        overflow: auto;
        padding: 0;
        padding-top: 2rem;
        padding-bottom: 2rem;
        min-height: calc(var(--mobile-padding-base) + 44px);
        width: 100vw;
        height: 100vh;
        background: ${colors.gray.plus2};
        box-shadow: 0 2px 18px rgba(0, 0, 0, 0.12);
        opacity: 1;
        transition: transform 300ms ${ease.out}, opacity 150ms linear;
        transform: translateX(0%);
        grid-area: nav;

        &.nav-hidden {
          opacity: 0;
          transform: translateX(-100%);

          ${media[2]} {
            display: block;
            visibility: visible;
            opacity: 1;
            transform: none;
          }
        }

        ${media[2]} {
          position: sticky;
          top: 0;
          padding-top: 0;
          padding-bottom: 0;
          max-width: var(--nav-desktop-width);
          height: 100%;
          background: transparent;
          box-shadow: none;

          .nav_top-level {
            margin: 0;
            padding: 0;
          }
        }

        .nav_l1:not(.active) .nav_l2,
        .nav_l2:not(.active) .nav_l3 {
          display: none;
          visibility: hidden;
        }

        .nav_l1,
        .nav_l2,
        .nav_l3 {
          list-style-type: none;
        }

        .nav_children {
          padding: 0;
          transition: height 200ms ${ease.inOut};

          &[data-collapsed='true'] {
            overflow: hidden;
          }
        }
      `}
    >
      <button
        className="button button-sm"
        onClick={() => {
          const nav = document.querySelector('nav');
          const body = document.querySelector('body');

          nav.classList.toggle('nav-hidden');
          body.classList.toggle('scroll-locked');
        }}
        css={css`
          margin-left: 1.5rem;
          min-height: var(--touchable);
          border-color: currentColor;
          color: black;

          ${media[2]} {
            display: none;
            visibility: hidden;
          }
        `}
      >
        ✕ Close
      </button>
      <ul
        className="nav_top-level"
        css={css`
          margin: 0;
          padding: 0;

          ${media[2]} {
            display: block;
            visibility: visible;
          }

          .active {
            > button.nav_element::after {
              transform: rotate(180deg);
            }

            > a.nav_element {
              font-weight: 600;
            }
          }

          button.nav_element {
            display: flex;
            justify-content: space-between;

            &::after {
              width: 44px;
              height: 44px;
              background-image: url("data:image/svg+xml,%3Csvg width='12' height='6' viewBox='0 0 12 6' xmlns='http://www.w3.org/2000/svg'%3E %3Cpath d='M6.023 5.681a.356.356 0 01-.232-.085L.305.953A.36.36 0 01.77.404l5.252 4.444L11.229.405a.36.36 0 01.467.547l-5.44 4.643a.36.36 0 01-.233.086' fill='%23000' fill-rule='evenodd'/%3E %3C/svg%3E");
              background-position: center;
              background-repeat: no-repeat;
              content: '';
              transition: transform 200ms linear;
              transform: rotate(0deg);
            }
          }

          .nav_l1,
          .nav_l2,
          .nav_l3,
          .nav_element {
            min-height: var(--touchable);
            width: 100%;
            text-align: left;
          }

          .nav_element {
            display: flex;
            outline-offset: -1px;

            color: black;
            text-transform: uppercase;
            letter-spacing: 1.6px;
            align-items: center;
          }

          .nav_l1 {
            .nav_element {
              padding-left: var(--nav-padding-base);
              font-weight: 500;
              font-size: ${fontSize(1)};
            }
          }

          .nav_l2 {
            .nav_element {
              padding-left: calc(var(--nav-padding-base) * 2);
              color: ${colors
                .chroma(colors.gray.base)
                .darken(0.75)
                .css()};
              text-transform: uppercase;
              letter-spacing: 0;
              font-weight: 400;
              font-size: ${fontSize(0)};
            }

            &.active {
              > .nav_element {
                color: black;
              }
            }
          }

          .nav_l3 {
            .nav_element {
              padding-left: calc(var(--nav-padding-base) * 3);
              color: ${colors
                .chroma(colors.gray.base)
                .darken(0.75)
                .css()};
              text-transform: none;
              font-size: ${fontSize(-1)};
            }

            &.active {
              .nav_element {
                position: relative;
                margin-left: -0.5em;
                color: black;

                &::before {
                  position: relative;
                  left: -0.5em;
                  width: 0.5em;
                  height: 0.5em;
                  border-radius: 50%;
                  background: black;
                  content: '';
                }
              }
            }
          }
        `}
      >
        {navData.l1s.map((l1) => {
          return (
            <li
              key={l1.slug}
              className={cx(
                'nav_l1',
                activeL1.slug === l1.slug ? 'active' : null
              )}
            >
              {l1.l2s.length === 0 ? (
                <Link to={l1.slug} className="nav_element">
                  {l1.name}
                </Link>
              ) : (
                <>
                  <button
                    className="button-minimal button nav_element"
                    onClick={(e) => {
                      e.target.parentElement.classList.toggle('active');
                      // expandOrCollapseEl(e.target.nextElementSibling);
                    }}
                  >
                    {l1.name}
                  </button>
                  <ul
                    className={cx('nav_children', {
                      'nav_children-hidden': activeL1.slug !== l1.slug,
                    })}
                  >
                    {l1.l2s.map((l2) => {
                      return (
                        <li
                          key={l2.slug}
                          className={cx(
                            'nav_l2',
                            activeL2.slug === l2.slug ? 'active' : null
                          )}
                        >
                          {l2.l3s.length === 0 ? (
                            <Link to={l2.slug} className="nav_element">
                              {l2.name}
                            </Link>
                          ) : (
                            <>
                              <button
                                className="button-minimal button nav_element"
                                to={l2.slug}
                                onClick={(e) => {
                                  e.target.parentElement.classList.toggle(
                                    'active'
                                  );
                                  // expandOrCollapseEl(
                                  //   e.target.nextElementSibling
                                  // );
                                }}
                              >
                                {l2.name}
                              </button>

                              <ul className="nav_children">
                                {l2.l3s.map((l3) => {
                                  return (
                                    <li
                                      key={l3.slug}
                                      className={cx(
                                        'nav_l3',
                                        activeL3.slug === l3.slug
                                          ? 'active'
                                          : null
                                      )}
                                    >
                                      <Link
                                        to={l3.slug}
                                        className="nav_element"
                                      >
                                        {l3.name}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
