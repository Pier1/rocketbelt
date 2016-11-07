(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      var exec = require('child_process').exec;
      return exec('find ' + config.templatesPath +  ' -type l -delete', function (err, stdout, stderr) { });
    };
  };
})();
