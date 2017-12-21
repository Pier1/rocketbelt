'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      plugins.vinylFs.src(['node_modules/hoverintent/dist/hoverintent.min.js'])
        .pipe(plugins.rename('rocketbelt.hoverintent.js'))
        .pipe(plugins.vinylFs.dest(config.patternsPath + '/base/vendor/'));

      return plugins.vinylFs.src([config.templatesPath + '/**/*.js'])
        .pipe(plugins.changed(config.buildPath))
        .pipe(plugins.vinylFs.dest(config.buildPath, { overwrite: true }));
    };
  };
})();
