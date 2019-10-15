import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import Helmet from 'react-helmet';

import H from './src/components/htag';
import LiveCode from './src/components/live-code.js';

const components = {
  h1: (props) => <H level={1} {...props} />,
  h2: (props) => <H level={2} {...props} />,
  h3: (props) => <H level={3} {...props} />,
  h4: (props) => <H level={4} {...props} />,
  pre: (props) => <LiveCode {...props} />,
  Helmet: Helmet,
};

export const onInitialClientRender = () => {
  const fontLoader = document.createElement('script');

  fontLoader.setAttribute(
    'src',
    'https://cdn.jsdelivr.net/npm/rocketbelt/dist/base/typography/rocketbelt.typography.font-loader.js'
  );

  document.head.appendChild(fontLoader);
};

export const wrapRootElement = ({ element }) => {
  return <MDXProvider components={components}>{element}</MDXProvider>;
};
