(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      return plugins.browserSync.init({
        reloadDebounce: 1000,
        server: {
          injectChanges: true,
          baseDir: config.buildPath
        }
      });
    };
  };
})();
