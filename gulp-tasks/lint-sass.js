(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      return gulp.src([config.patternsPath + '/**/*.scss', config.templatesPath + '/**/*.scss', '!**/vendor/**/*.scss'])
        .pipe(plugins.sassLint())
        .pipe(plugins.sassLint.format())
        .pipe(plugins.sassLint.failOnError());
    };
  };
})();
