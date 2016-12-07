var fs = require('fs');
var json = JSON.parse(fs.readFileSync('./.csscomb.json'));

function sortCSS (array) {
  var order = [];
  for (group of array) {
    order = order.concat(group);
  }
  return order;
}

(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      var cssOrder = sortCSS(json['sort-order']);
      console.log(cssOrder);
    };
  };
})();
