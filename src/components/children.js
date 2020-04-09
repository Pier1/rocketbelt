import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
const { addScript } = require('../utils/addScript.js');

const Children = ({ children, pageContext }) => {
  useEffect(() => {
    // This is a little hacky but can be removed/simplified after the dialog
    // refactor.
    if (document.body.classList.contains('is-dialog-open')) {
      document.body.classList.remove('is-dialog-open');

      const blurEl = document.querySelector('body > div:first-of-type');
      blurEl.classList.remove('dialog_blur');
      blurEl.attributes.removeNamedItem('aria-hidden');
    }

    if (
      pageContext &&
      pageContext.frontmatter &&
      pageContext.frontmatter.scriptTags &&
      pageContext.frontmatter.scriptTags.length > 0
    ) {
      pageContext.frontmatter.scriptTags.forEach((script) => {
        addScript(`/scripts/${script}`, `#mdx-wrapper`);
      });
    }
  });

  return <div id="mdx-wrapper">{children}</div>;
};

export default Children;
