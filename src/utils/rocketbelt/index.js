const ms = require('modularscale-js');
const chroma = require('chroma-js');

export const fontSize = (step) => {
  return `${(ms(step, { base: [15, 13], ratio: 1.333 }) / 15).toFixed(2)}rem`;
};

export const fontFamily = {
  sans: "'Brand Sans', Arial, sans-serif",
  serif: "'Brand Serif', 'Times New Roman', serif",
  monospace: "'RB Monospace', Monaco, Consolas, 'Lucida Console', monospace",
};

export const colors = {
  brand: {
    base: '#00205b',
    prussianBlue: '#00205b',
    columbiaBlue: '#ced9e5',
    catskillBlue: '#e8edf3',
    alabaster: '#f0ece2',
    logoBlue: '#0033a0',
  },
  gray: {
    minus2: '#333436',
    minus1: '#53565a',
    base: '#73777c',
    plus1: '#b6b9bc',
    plus2: '#f2f3f3',
  },
  indicating: {
    success: '#72b269',
    error: '#c32728',
    warningAlt: '#d5a021',
    warning: '#edd18d',
  },
  chroma: (color) => {
    return chroma(color);
  },
};

export const breakpoints = [480, 768, 992, 1200];
export const media = breakpoints.map((bp) => `@media (min-width: ${bp}px)`);
