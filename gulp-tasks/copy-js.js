'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      plugins.vinylFs.src(['node_modules/hoverintent/dist/hoverintent.min.js'])
        .pipe(plugins.rename('rocketbelt.hoverintent.js'))
        .pipe(plugins.vinylFs.dest(config.patternsPath + '/base/vendor/'));

      plugins.vinylFs.src(['node_modules/ra11y/dist/ra11y.js'])
        .pipe(plugins.rename('rocketbelt.ra11y.js'))
        .pipe(plugins.vinylFs.dest(config.patternsPath + '/base/vendor/'));

      return plugins.vinylFs.src([config.templatesPath + '/**/*.js'])
        .pipe(plugins.changed(config.buildPath))
        .pipe(plugins.vinylFs.dest(config.buildPath, { overwrite: true }));
    };
  };
})();
