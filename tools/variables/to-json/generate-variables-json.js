'use strict';

const sassExtract = require('sass-extract');

sassExtract.render(
  {
    file: './_rocketbelt.variables.scss'
  },
  {
    plugins: [
      'compact'
    ]
  }
)
.then(rendered => {
  // Would prefer to use the `filter` option in sass-extract
  // instead of this function, but it's unclearly documented.
  // https://github.com/jgranstrom/sass-extract#filter
  const sassVarsToEmit = [
    '$color-families',
    '$columns',
    '$gutter-width',
    '$half-gutter-width',
    '$gutter-compensation'
  ];

  for (const key in rendered.vars.global) {
    if (!sassVarsToEmit.includes(key)) {
      delete rendered.vars.global[key];
    }
  }

  return rendered.vars.global;
})
.then(vars => {
  const fs = require('fs');
  fs.writeFile(
    '../rocketbelt.variables.json',
    JSON.stringify(vars, null, 2), 'utf8', () => {}
  );
});
