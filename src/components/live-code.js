import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
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
  const [copyText, setCopyText] = useState('Copy');
  const editorRef = useRef(null);

  const handleChange = function(event) {
    if (event.target.checked) {
      setLabelText(hideText);
      setCodeHidden(false);
    } else {
      setLabelText(showText);
      setCodeHidden(true);
    }
  };

  const copyToClipboard = function(e) {
    const textArea = e.target.nextElementSibling.firstElementChild;

    const input = document.createElement('textarea');
    input.classList.add('visually-hidden');

    document.body.appendChild(input);
    input.value = textArea.defaultValue;
    input.focus();
    input.select();

    document.execCommand('copy');
    document.body.removeChild(input);

    setCopyText('Copied');
    setTimeout(function() {
      setCopyText('Copy');
    }, 2000);
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
          <div className="component-example_code">
            <button onClick={copyToClipboard} className="button button-copy">
              {copyText}
            </button>
            <LiveEditor />
          </div>
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
              <button onClick={copyToClipboard} className="button button-copy">
                {copyText}
              </button>
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
