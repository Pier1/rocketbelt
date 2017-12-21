'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      return gulp.src('dist')
        .pipe(plugins.webserver({
          port: 8080
        }))
      ;
    };
  };
})();
