'use strict';
(() => {
  const debounce = (func, wait, immediate) => {
    let timeout;
    return () => {
      const context = this;
      const args = arguments;

      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) { func.apply(context, args); }
    };
  };

  module.exports = (gulp, plugins, config) => {
    return () => {
      gulp.watch(['./rocketbelt/**/*.scss', './templates/scss/**/*.scss'], ['styles']);
      gulp.watch(['./templates/**/*.pug'], ['views', 'link-templates']);
      gulp.watch(['./rocketbelt/**/*.js'], ['copy-js', 'uglify']);
      gulp.watch(config.buildPath + '/**/*.html')
        .on('change', plugins.browserSync.reload);
      gulp.watch(config.buildPath + '/**/*.js')
        .on('change', plugins.browserSync.reload);

      global.isWatching = true;

      return true;
    }
  };
})();
