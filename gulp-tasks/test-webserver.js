(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      return gulp.src('dist')
        .pipe(plugins.webserver({
          port: 8080
        }))
      ;
    };
  };
})();
