import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { media, fontSize, colors } from '../utils/rocketbelt';

import RbLogo from '../images/rb-logo-white.svg';
import RbIcon from '../components/rb-icon';

const IndexPage = () => {
  const sectionStyles = css`
    margin-bottom: 3rem;
    padding: 1rem;
    background: #fff;
    box-shadow: 0 2px 24px 0
      ${colors
        .chroma('#fff')
        .darken(2)
        .alpha(0.1)
        .css()};

    ${media[1]} {
      padding: 2rem;
    }
  `;
  return (
    <Layout noShadow={true}>
      <SEO title="Home" />
      <section
        className="hero"
        css={css`
          margin: 0 -1rem 3rem -1rem;
          padding: 2rem 1rem;
          background-color: ${colors.brand.prussianBlue};
          box-shadow: 0 2px 24px 0
            ${colors
              .chroma(colors.brand.prussianBlue)
              .darken()
              .alpha(0.2)
              .css()};
          color: #fff;
          text-align: center;

          ${media[0]} {
            margin: 1rem 0 3rem 0;
            border-radius: 4px;
          }

          .logo-container-logo {
            height: 4rem;
          }

          .emphasize {
            color: #fff;
          }
        `}
      >
        <div className="logo-container">
          <img className="logo-container-logo" src={RbLogo} />
        </div>
        <h1
          className="rb-title"
          // These have to be inline to override the RB default heading styles…
          style={{
            fontWeight: 'normal',
            textTransform: 'uppercase',
            letterSpacing: '3.6px',
          }}
        >
          Rocketbelt
        </h1>
        <p
          className="lede"
          css={css`
            margin-bottom: 0;
            font-weight: normal;
            font-size: ${fontSize(2)};
            line-height: 1.3;
          `}
        >
          The Rocketbelt Pattern Library makes it easier to design & build{' '}
          <span className="emphasize">human-centered</span>,{' '}
          <span className="emphasize">accessible</span>,{' '}
          <span className="emphasize">mobile-friendly</span> websites.
        </p>
      </section>

      <section css={sectionStyles}>
        <h2>Use Rocketbelt to…</h2>
        <ul>
          <li>Elevate to your site's cohesiveness & consistency</li>
          <li>
            Accelerate the pace with which teams can design & build great
            experiences
          </li>
          <li>
            Allow developers & designers to focus less on pixels and more on
            behavior & interaction
          </li>
          <li>
            Give designers & developers a shared vocabulary with which to
            communicate clearly & efficiently
          </li>
        </ul>
      </section>

      <section css={sectionStyles}>
        <h2>Benefits</h2>
        <div
          className="card-container grid-fluid"
          css={[
            css`
              display: grid;

              ${media[1]} {
                grid-auto-flow: column;
                grid-template-columns: 1fr 1fr 1fr;
              }

              .card {
                ${media[1]} {
                  margin: 0 1rem;
                  min-height: 10rem;

                  &:first-of-type {
                    margin-left: 0;
                  }

                  &:last-of-type {
                    margin-right: 0;
                  }
                }

                .icon {
                  margin: 1rem 0;
                  width: 64px;
                  height: 64px;
                  color: ${colors.brand.prussianBlue};
                  align-self: center;
                }
              }

              .card,
              .card-content {
                padding: 0;
              }

              .card-body {
                display: flex;
                flex-direction: column;

                .benefit-title {
                  display: flex;
                  flex-direction: column;
                  font-weight: 400;

                  &::after {
                    margin: 1rem 0;
                    width: 48px;
                    height: 6px;
                    background-color: ${colors.brand.logoBlue};
                    content: '';
                  }
                }
              }
            `,
          ]}
        >
          <div className="card">
            <div className="card-content">
              <div className="card-body">
                <h3 className="benefit-title">Components</h3>
                <RbIcon icon="carrier" />
                <p>
                  Fine-tuned HTML & CSS patterns make up the core of Rocketbelt.
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="card-body">
                <h3 className="benefit-title">Sass & JavaScript Helpers</h3>
                <svg
                  className="icon"
                  width="259"
                  height="245"
                  viewBox="0 0 259 245"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M83 245v-13.414c-19.604 0-36.153-4.81-34.371-21.514l5.601-56.188c1.782-20.5-4.074-28.347-19.095-31.384 15.021-3.037 20.877-12.149 19.095-31.384L48.63 34.928C46.847 18.476 63.396 13.414 83 13.414V0C59.831 0 30.807 7.34 33.862 37.206l5.856 52.138c1.527 16.705-1.782 26.829-39.718 26.829v12.654c37.936 0 41.245 10.63 39.718 27.335l-5.856 51.632C30.807 237.914 59.832 245 83 245zm93 0c23.169 0 52.193-7.34 49.138-37.206l-5.856-51.632c-1.527-16.704 5.347-27.335 39.718-27.335v-12.654c-34.117 0-41.245-10.124-39.718-26.829l5.856-52.138C228.193 7.086 199.168 0 176 0v13.414c19.604 0 36.153 5.062 34.371 21.514l-5.601 56.188c-1.782 18.982 4.837 28.347 22.66 31.637-19.35 2.784-24.442 10.63-22.66 31.131l5.601 56.188c1.782 16.705-14.767 21.514-34.371 21.514V245z"
                    fillRule="nonzero"
                  />
                </svg>
                <p>
                  Let Rocketbelt's Sass & JS helpers relieve you of memorizing
                  font sizes, hex codes, and accessibility boilerplate!
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <div className="card-body">
                <h3 className="benefit-title">Sketch Library & Assets</h3>
                <RbIcon icon="stack-o" />
                <p>
                  Rocketbelt includes a comprehensive Sketchfile with nested
                  symbols that correspond to the patterns you see on the site.
                  Components, iconography, colors… it's all there!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section css={sectionStyles}>
        <h2>Get Started</h2>
        <p>
          Browse the components on the site. Clone the repo. Make an improvement
          and submit a pull request, or supercharge your design workflow with
          the Sketch assets.
        </p>
        <div
          className="buttons"
          css={css`
            display: flex;
            justify-content: flex-end;
          `}
        ></div>
      </section>
    </Layout>
  );
};

export default IndexPage;
