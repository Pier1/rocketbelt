import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { theme } from './theme';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { cx } from 'emotion';

const LiveCode = (props) => {
  const className = props.children.props.className || '';
  const matches = className.match(/language-(?<lang>.+)/);
  const hasLang = matches && matches.groups && matches.groups.lang;
  const language = hasLang ? matches.groups.lang.split(' ')[0] : '';
  const previewClasses =
    props &&
    props.children &&
    props.children.props &&
    props.children.props.metastring
      ? `component-example_previewee ${props.children.props.metastring}`
      : `component-example_preview`;

  console.dir(props.children);

  const showText = `Show ${language.toUpperCase()}`;
  const hideText = `Hide ${language.toUpperCase()}`;
  const [labelText, setLabelText] = useState(showText);
  const [codeHidden, setCodeHidden] = useState(true);
  const [copyText, setCopyText] = useState('Copy');

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
    const textArea = e.target.closest('.button-copy').nextElementSibling
      .firstElementChild;

    const input = document.createElement('textarea');
    input.classList.add('visually-hidden');

    document.body.appendChild(input);
    input.value = textArea.defaultValue;
    input.select();

    document.execCommand('copy');
    document.body.removeChild(input);

    setCopyText('Copied');
    setTimeout(function() {
      setCopyText('Copy');
    }, 2000);
  };

  const examplePreviewCss = css`
    border: 1px solid #b6b9bc66;
    padding: 1rem;
  `;

  return (
    <LiveProvider
      language={language}
      disabled={true}
      code={`${props.children.props.children.trim()}`}
      transformCode={(code) => {
        return language === 'html' ? `<>${code}</>` : code;
      }}
      theme={theme}
    >
      <section className="component-example">
        {props.children.props['code-only'] ? (
          <div
            className="component-example_code"
            data-rb-example-lang={language.toUpperCase()}
          >
            <button onClick={copyToClipboard} className="button button-copy">
              <span className="button-copy_language">
                {language.toUpperCase()}
              </span>
              <span className="button-copy_text">{copyText}</span>
            </button>
            <LiveEditor />
          </div>
        ) : props.children.props['render-only'] &&
          !props.children.props.className.includes('-js') ? (
          <div
            css={examplePreviewCss}
            className={previewClasses}
            dangerouslySetInnerHTML={{
              __html: props.children.props.children.trim(),
            }}
          ></div>
        ) : (
          <>
            {!props.children.props['run-on-load'] &&
              !props.children.props.className.includes('-js') && (
                <>
                  <div
                    css={examplePreviewCss}
                    className={previewClasses}
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
                    data-rb-example-lang={language.toUpperCase()}
                  >
                    <button
                      onClick={copyToClipboard}
                      className="button button-copy"
                    >
                      <span className="button-copy_language">
                        {language.toUpperCase()}
                      </span>
                      <span className="button-copy_text">{copyText}</span>
                    </button>
                    <LiveEditor />
                  </div>
                </>
              )}
          </>
        )}
      </section>
      {!props.children.props['code-only'] &&
        !props.children.props['run-on-load'] && <LiveError />}
    </LiveProvider>
  );
};

export default LiveCode;
