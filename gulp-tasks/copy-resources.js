'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      return plugins.vinylFs.src([
        config.templatesPath + '/**/img/*.*',
        config.templatesPath + '/**/*.svg',
        config.templatesPath + '/**/*.zip'
      ])
        .pipe(plugins.changed(config.buildPath))
        .pipe(plugins.vinylFs.dest(config.buildPath, { overwrite: true }));
    };
  };
})();
