'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      console.log(`${config.patternsPath}/**/*.js`);
      return gulp.src([`${config.patternsPath}/**/*.js`, `!${config.patternsPath}/**/*.min.js`])
        .pipe(plugins.changed(config.buildPath))
        .pipe(plugins.plumber({
          errorHandler: plugins.notify.onError('Error: <%= error.message %>')
        }))
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.babel({
          presets: [
            ['env', { 'modules': false }]
          ],
          ignore: [
            // Keep these files from breaking until they're refactored to ES6 code.
            `${config.patternsPath}/components/dialogs/**/*.js`,
            `${config.patternsPath}/components/buttons/rocketbelt.dynamic-button.js`
          ]
        }))
        .pipe(plugins.uglify())
        .pipe(plugins.size(config.sizeOptions))
        .pipe(plugins.sourcemaps.write('.', { sourceRoot: '.' }))
        .pipe(gulp.dest(config.buildPath))
      ;
    };
  };
})();
