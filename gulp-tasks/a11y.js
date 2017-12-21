'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      const firstRun = plugins.cached.caches['html'] ? false : true;

      return gulp.src(config.buildPath + '/**/*.html')
        .pipe(plugins.if(global.isWatching, plugins.cached('html')))
        .pipe(plugins.if(global.isWatching && !firstRun, plugins.a11y()))
        .pipe(plugins.if(global.isWatching && !firstRun, plugins.a11y.reporter()))
      ;
    };
  };
})();
