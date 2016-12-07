var yaml = require('js-yaml');
var fs = require('fs');
var cssYaml = yaml.safeLoad(fs.readFileSync('./.sass-lint.yml', 'utf8'));
var cssJson = JSON.parse(fs.readFileSync('./.csscomb.json'));

function sortCSS (array) {
  var order = [];
  for (group of array) {
    // accounts for any csscomb style groups (arrays in array)
    order = order.concat(group);
  }
  return order;
}

function setYaml (newOrder) {
  var rules = cssYaml.rules['property-sort-order'];
  rules = rules.filter(rule => rule.hasOwnProperty('order'));

  // rewrites the sass-lint sort-order
  rules[0].order = newOrder;

  // return format to Yaml
  cssYaml = yaml.safeDump(cssYaml);
}

(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      var cssOrder = sortCSS(cssJson['sort-order']);
      setYaml(cssOrder);
      fs.writeFile('./.sass-lint.yml', cssYaml, function (err) {
        if (err) return console.log(err);
      })
    };
  };
})();
