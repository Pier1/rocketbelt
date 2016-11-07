(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      return gulp.src(config.buildPath + '/**/*.html')
        .pipe(plugins.if(global.isWatching, plugins.cached('html')))
        .pipe(plugins.a11y())
        .pipe(plugins.a11y.reporter())
      ;
    };
  };
})();
