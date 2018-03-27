'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      return gulp.src([config.patternsPath + '/**/*.scss', config.templatesPath + '/**/*.scss', '!**/vendor/**/*.scss', '!' + config.patternsPath + '/**/animation/**/*.scss'])
        .pipe(plugins.sassLint())
        .pipe(plugins.sassLint.format())
        .pipe(plugins.sassLint.failOnError());
    };
  };
})();
