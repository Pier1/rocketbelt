import React, { useState } from 'react';
import colorContrast from 'color-contrast';

const ColorContrastCalculator = () => {
  const [swatch1Bg, setSwatch1Bg] = useState({
    background: 'red',
  });
  const [swatch2Bg, setSwatch2Bg] = useState({
    background: 'red',
  });

  const calculateContrast = (e) => {
    const isColor1 = e.target.id === 'color-1' ? true : false;
    const targetVal = e.target.value;

    const validColorRe = /^(#([\da-f]{3}){1,2}|(rgb|hsl)a\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))$/i;
    const targetValmatches = targetVal.match(validColorRe);

    const bg = {
      background: e.target.value,
    };

    if (targetValmatches) {
      isColor1 ? setSwatch1Bg(bg) : setSwatch2Bg(bg);

      const otherInput = e.target.id === 'color-1' ? 'color-2' : 'color-1';
      const otherVal = document.querySelector(`#${otherInput}`).value;
      const otherValMatches = otherVal.match(validColorRe);

      if (otherValMatches) {
        isColor1 ? setSwatch1Bg(bg) : setSwatch2Bg(bg);
        const contrast = colorContrast(targetVal, otherVal);
        console.dir(contrast);
      }
    }
  };

  return (
    <section className="color-contrast-calculator">
      <div className="form-group inline">
        <input
          id="color-1"
          className="required-suppressed"
          type="text"
          onChange={calculateContrast}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <label htmlFor="color-1">Color 1</label>
        <div className="swatch color-1_swatch" style={swatch1Bg} />
      </div>
      <div className="form-group inline">
        <input
          id="color-2"
          className="required-suppressed"
          type="text"
          onChange={calculateContrast}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <label htmlFor="color-2">Color 2</label>
        <div className="swatch color-2_swatch" style={swatch2Bg} />
      </div>
    </section>
  );
};

ColorContrastCalculator.propTypes = {};

export default ColorContrastCalculator;
