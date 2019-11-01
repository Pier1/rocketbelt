import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import Helmet from 'react-helmet';

import H from './src/components/htag';
import LiveCode from './src/components/live-code.js';
const { addScript } = require('./src/utils/addScript.js');

const components = {
  h1: (props) => <H level={1} {...props} />,
  h2: (props) => <H level={2} {...props} />,
  h3: (props) => <H level={3} {...props} />,
  h4: (props) => <H level={4} {...props} />,
  pre: (props) => <LiveCode {...props} />,
  Helmet: Helmet,
};

// export const onClientEntry = function() {
//   window.onload = () => {
//     if (window.location.hash !== '') {
//       console.dir(document.querySelector(`${window.location.hash}`));
//       // document.querySelector(`${window.location.hash}`).scrollIntoView();
//     }
//   };
// };

// export const onRouteUpdate = (location) => {
//   if (location.hash) {
//     setTimeout(() => {
//       document.querySelector(`${location.hash}`).scrollIntoView();
//     }, 0);
//   }
// };

export const onInitialClientRender = () => {
  addScript(
    'https://cdn.jsdelivr.net/npm/rocketbelt/dist/base/typography/rocketbelt.typography.font-loader.js'
  );
};

export const wrapRootElement = ({ element }) => {
  return <MDXProvider components={components}>{element}</MDXProvider>;
};
