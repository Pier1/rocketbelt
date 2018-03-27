'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      plugins.del(['**/*/.DS_Store']);
      plugins.del([config.buildPath]);
      return true;
    };
  };
})();
