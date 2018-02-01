'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      return gulp.src([config.patternsPath + '/**/*.js',
                       config.patternsPath + '/**/*.scss',
                       '!' + config.patternsPath + '/base/feature-detection/*.js'])
        .pipe(plugins.modernizr('rocketbelt.feature-detection.js',
          {
            options: [
              'setClasses'
            ],
            tests: [
              'touchevents'
            ]
          }))
        .pipe(gulp.dest(config.patternsPath + '/base/feature-detection'))
      ;
    };
  };
})();
