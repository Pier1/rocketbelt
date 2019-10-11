import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import Helmet from 'react-helmet';

import { theme } from './src/components/theme';
import H from './src/components/htag';

const LiveCode = (props) => {
  const className = props.children.props.className || '';
  const matches = className.match(/language-(?<lang>.+)/);
  const language =
    matches && matches.groups && matches.groups.lang ? matches.groups.lang : '';

  return (
    <LiveProvider
      language={language}
      disabled={true}
      code={`${props.children.props.children.trim()}`}
      transformCode={(code) => `<>${code}</>`}
      theme={theme}
    >
      <section className="component-example">
        {props.children.props['code-only'] ? (
          <LiveEditor />
        ) : props.children.props['render-only'] ? (
          <LivePreview />
        ) : (
          <>
            <div
              className="component-example_preview"
              dangerouslySetInnerHTML={{
                __html: props.children.props.children.trim(),
              }}
            ></div>
            <div className="component-example_code">
              <LiveEditor />
            </div>
          </>
        )}
        <LiveError />
      </section>
    </LiveProvider>
  );
};

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
