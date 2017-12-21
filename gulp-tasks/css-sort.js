'use strict';

const yaml = require('js-yaml');
const fs = require('fs');
let cssYaml = yaml.safeLoad(fs.readFileSync('./.sass-lint.yml', 'utf8'));
const cssJson = JSON.parse(fs.readFileSync('./.csscomb.json'));

function sortCSS(array) {
  let order = [];
  for (let group of array) {
    // accounts for any csscomb style groups (arrays in array)
    order = order.concat(group);
  }
  return order;
}

function setYaml(newOrder) {
  let rules = cssYaml.rules['property-sort-order'];
  rules = rules.filter(rule => rule.hasOwnProperty('order'));

  // rewrites the sass-lint sort-order
  rules[0].order = newOrder;

  // return format to Yaml
  cssYaml = yaml.safeDump(cssYaml);
}

(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      const cssOrder = sortCSS(cssJson['sort-order']);
      setYaml(cssOrder);
      fs.writeFile('./.sass-lint.yml', cssYaml, (err) => {
        if (err) {
          return console.log(err);
        }
      })
    };
  };
})();
