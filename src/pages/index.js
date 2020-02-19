import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { media, fontSize } from '../utils/rocketbelt';
const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1
      className="rb-title"
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
        font-size: ${fontSize(2)};
        font-weight: normal;
        line-height: 1.3;

        .emphasize {
          color: #333436;
        }
      `}
    >
      The Rocketbelt Pattern Library makes it easier to design & build{' '}
      <span className="emphasize">human-centered</span>,{' '}
      <span className="emphasize">accessible</span>,{' '}
      <span className="emphasize">mobile-friendly</span> websites.
    </p>
    <p>Use Rocketbelt to…</p>
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
  </Layout>
);

export default IndexPage;
