(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      return plugins.browserSync.init({
        server: {
          injectChanges: true,
          baseDir: config.buildPath
        }
      });
    };
  };
})();
