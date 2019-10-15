import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { theme } from './theme';

const LiveCode = (props) => {
  const className = props.children.props.className || '';
  const matches = className.match(/language-(?<lang>.+)/);
  const language =
    matches && matches.groups && matches.groups.lang ? matches.groups.lang : '';

  const showText = `Show ${language.toUpperCase()}`;
  const hideText = `Hide ${language.toUpperCase()}`;
  const [labelText, setLabelText] = useState(showText);
  const [codeHidden, setCodeHidden] = useState(true);

  const handleChange = function(event) {
    if (event.target.checked) {
      setLabelText(hideText);
      setCodeHidden(false);
    } else {
      setLabelText(showText);
      setCodeHidden(true);
    }
  };

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
          <div
            className="component-example_preview"
            dangerouslySetInnerHTML={{
              __html: props.children.props.children.trim(),
            }}
          ></div>
        ) : (
          <>
            <div
              className="component-example_preview"
              dangerouslySetInnerHTML={{
                __html: props.children.props.children.trim(),
              }}
            ></div>
            <label className="component-example_toggle">
              <input
                onChange={handleChange}
                type="checkbox"
                className="visually-hidden"
              />
              {labelText}
            </label>
            <div
              className={`component-example_code ${
                codeHidden ? 'visually-hidden' : ''
              }`}
            >
              <LiveEditor />
            </div>
          </>
        )}
        <LiveError />
      </section>
    </LiveProvider>
  );
};

export default LiveCode;
