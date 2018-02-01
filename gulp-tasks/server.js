'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
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
