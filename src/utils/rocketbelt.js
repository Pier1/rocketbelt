const c = {
  brand: {
    base: '#00205b',
    prussianBlue: '#00205b',
    catskillBlue: '#ced9e5',
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
};

const breakpoints = [480, 768, 992, 1200];

export const color = c;
export const media = breakpoints.map((bp) => `@media (min-width: ${bp}px)`);
