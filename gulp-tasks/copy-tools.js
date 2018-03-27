'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      return gulp
        .src([config.patternsPath + '/tools/**/*'])
        .pipe(gulp.dest(config.buildPath + '/tools'));
    };
  };
})();
