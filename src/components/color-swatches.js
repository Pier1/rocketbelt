import PropTypes from 'prop-types';
import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const classNames = require('classnames');
const Color = require('color');

const ColorSwatches = ({ swatchSet }) => {
  let swatches = [];

  if (swatchSet === 'brand') {
    swatches = [
      {
        name: 'Prussian Blue',
        hex: '#00205b',
        scss: 'color(brand, prussianBlue)',
        fnfamily: 'brand',
        fnColor: 'prussianBlue',
      },
      {
        name: 'Logo Blue',
        hex: '#0033a0',
        scss: 'color(brand, logoBlue)',
        fnfamily: 'brand',
        fnColor: 'logoBlue',
      },
      {
        name: 'Columbia Blue',
        hex: '#ced9e5',
        scss: 'color(brand, columbiaBlue)',
        fnFamily: 'brand',
        fnColor: 'columbiaBlue',
      },
      {
        name: 'Catskill Blue',
        hex: '#e8edf3',
        scss: 'color(brand, catskillBlue)',
        fnFamily: 'brand',
        fnColor: 'catskillBlue',
      },
      {
        name: 'Alabaster',
        hex: '#f0ece2',
        scss: 'color(brand, alabaster)',
        fnFamily: 'brand',
        fnColor: 'alabaster',
      },
    ];
  } else if (swatchSet === 'grays') {
    swatches = [
      {
        name: 'White',
        hex: '#fff',
        scss: 'color(white)',
        fnColor: 'white',
      },
      {
        name: 'Black Haze',
        hex: '#f2f3f3',
        scss: 'color(gray, plus2)',
        fnFamily: 'gray',
        fnColor: 'plus2',
      },
      {
        name: 'Silver Sand',
        hex: '#b6b9bc',
        scss: 'color(gray, plus1)',
        fnFamily: 'gray',
        fnColor: 'plus1',
      },
      {
        name: 'Sonic Silver',
        hex: '#73777c',
        scss: 'color(gray)',
        fnFamily: 'gray',
        fnColor: '',
      },
      {
        name: 'Abbey',
        hex: '#53565a',
        scss: 'color(gray, minus1)',
        fnFamily: 'gray',
        fnColor: 'minus1',
      },
      {
        name: 'Jet',
        hex: '#333436',
        scss: 'color(gray, minus2)',
        fnFamily: 'gray',
        fnColor: 'minus2',
      },
      {
        name: 'Black',
        hex: '#000',
        scss: 'color(black)',
        fnColor: 'black',
      },
    ];
  } else if (swatchSet === 'indicating') {
    swatches = [
      {
        name: 'Error',
        hex: '#c1292e',
        scss: 'color(error)',
        fnColor: 'error',
      },
      {
        name: 'Warning (Alt)',
        hex: '#d5a021',
        scss: 'color(warning-b)',
        fnColor: 'warning-b',
      },
      {
        name: 'Warning',
        hex: '#edd18d',
        scss: 'color(warning)',
        fnColor: 'warning',
      },
      {
        name: 'Success',
        hex: '#3d7733',
        scss: 'color(success)',
        fnColor: 'success',
      },
      {
        name: 'Info',
        hex: '#0033a0',
        scss: 'color(info)',
        fnColor: 'info',
      },
    ];
  }

  const copyToClipboard = (e, text) => {
    const input = document.createElement('textarea');
    input.classList.add('visually-hidden');

    document.body.appendChild(input);
    input.value = text;
    input.select();

    document.execCommand('copy');
    document.body.removeChild(input);

    const button = e.target.closest('button');
    button.classList.add('swatch-copied');

    setTimeout(() => {
      button.classList.remove('swatch-copied');
    }, 1500);
  };

  const buttonCss = css`
    &.swatch-copied {
      & .swatch {
        position: relative;
      }
      & .swatch::after {
        content: 'Copied';
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      & .swatch.swatch-dark::after {
        color: white;
      }
    }
  `;

  return (
    <ul className={`swatches ${swatchSet} list-reset-horizontal`}>
      {swatches.map((swatch) => {
        const color = Color(swatch.hex);
        return (
          <li className="swatch_wrapper" key={`${swatch.scss}`}>
            <button
              css={buttonCss}
              onClick={(e) => {
                copyToClipboard(e, `${swatch.scss}`);
              }}
              className={`button-minimal button`}
            >
              <span
                className={classNames(
                  'swatch',
                  swatch.fnColor,
                  swatch.name.replace(' ', '-').toLowerCase(),
                  color.isDark() ? 'swatch-dark' : 'swatch-light'
                )}
                style={{ background: swatch.hex }}
              ></span>
              <span className="swatch_name">{swatch.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

ColorSwatches.propTypes = {
  // swatchSet: PropTypes.object.isRequired,
};

export default ColorSwatches;
