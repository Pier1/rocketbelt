import PropTypes from 'prop-types';
import React from 'react';

const FontWeightSpecimens = ({ typeface }) => {
  const fonts =
    typeface === 'serif'
      ? ['regular', 'italic', 'bold']
      : 'sans'
      ? ['regular', 'italic', 'bold', 'extra-bold']
      : [];

  const token = typeface === 'serif' ? 'EB' : 'Ms';
  return (
    <ul className={`${typeface} font-weight-specimens list-reset-horizontal`}>
      {fonts.map((font) => {
        return (
          <li className="font-weight-specimen" key={`${typeface}-${font}`}>
            <span className={`token ${font}`}>{token}</span>
            <span className="font">{font.replace('-', ' ')}</span>
          </li>
        );
      })}
    </ul>
  );
};

FontWeightSpecimens.propTypes = {
  typeface: PropTypes.string.isRequired,
};

export default FontWeightSpecimens;
