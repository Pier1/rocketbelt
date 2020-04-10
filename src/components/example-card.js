import React, { useEffect } from 'react';
const { addScript } = require('../utils/addScript.js');
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { fontFamily } from '../utils/rocketbelt';

const ExampleCard = ({ children, className }) => {
  console.dir(fontFamily);
  return (
    <div
      className={className}
      css={css`
        display: inline-flex;
        margin-top: 1rem;
        margin-right: 2rem;
        margin-bottom: 1rem;
        width: 8rem;
        height: 8rem;
        align-items: center;
        justify-content: center;
        font-family: ${fontFamily.monospace};
      `}
    >
      {children}
    </div>
  );
};

export default ExampleCard;
