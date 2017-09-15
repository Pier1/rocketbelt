(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      plugins.del(['**/*/.DS_Store']);
      plugins.del([config.buildPath]);
      return true;
    };
  };
})();
