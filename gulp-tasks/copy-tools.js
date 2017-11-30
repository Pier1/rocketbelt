(function () {
  'use strict';

  module.exports = function copyTools(gulp, plugins, config) {
    return function copyToolsBody() {
      return gulp
        .src([config.patternsPath + '/tools/**/*'])
        .pipe(gulp.dest(config.buildPath + '/tools'));
    };
  };
})();
