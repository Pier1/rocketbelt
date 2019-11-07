import React, { useState } from 'react';
import colorContrast from 'color-contrast';

const ColorContrastCalculator = () => {
  const [fg, setFg] = useState('transparent');
  const [bg, setBg] = useState('transparent');
  const [contrastRatio, setContrastRatio] = useState('');

  const calculateContrast = (e) => {
    const isBg = e.target.id === 'contrast_bg' ? true : false;
    const targetVal = e.target.value;

    const validColorRe = /^(#([\da-f]{3}){1,2}|(rgb|hsl)a\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))$/i;
    const targetValmatches = targetVal.match(validColorRe);

    const newVal = e.target.value;

    if (targetValmatches) {
      isBg ? setBg(newVal) : setFg(newVal);

      const otherInput = isBg ? 'contrast_fg' : 'contrast_bg';
      const otherVal = document.querySelector(`#${otherInput}`).value;
      const otherValMatches = otherVal.match(validColorRe);

      if (otherValMatches) {
        isBg ? setBg(newVal) : setFg(newVal);
        setContrastRatio(colorContrast(targetVal, otherVal).toFixed(2));
      }
    }
  };

  return (
    <section className="color-contrast-calculator">
      <div className="contrast_inputs">
        <div className="form-group">
          <input
            id="contrast_bg"
            className="required-suppressed"
            type="text"
            onChange={calculateContrast}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <label htmlFor="contrast_bg">Background</label>
        </div>
        <div className="form-group">
          <input
            id="contrast_fg"
            className="required-suppressed"
            type="text"
            onChange={calculateContrast}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <label htmlFor="contrast_fg">Foreground</label>
        </div>
      </div>
      <div className="contrast_example" style={{ background: bg, color: fg }}>
        <span
          className={`contrast_wcag-level ${
            contrastRatio < 3 ? 'contrast_wcag-level-fail' : ''
          }`}
        >
          {contrastRatio >= 7
            ? 'AAA'
            : contrastRatio >= 4.5
            ? 'AA'
            : contrastRatio >= 3
            ? 'AA*'
            : '😭'}
        </span>
        <span className="contrast_ratio">
          {contrastRatio !== '' ? contrastRatio : ''}
        </span>
      </div>
    </section>
  );
};

ColorContrastCalculator.propTypes = {};

export default ColorContrastCalculator;
