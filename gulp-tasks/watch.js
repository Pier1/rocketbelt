(function () {
  'use strict';

  var debounce = function (func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	};
  };

  module.exports = function (gulp, plugins, config) {
    return function () {
      gulp.watch(['./rocketbelt/**/*.scss', './templates/scss/**/*.scss'], ['styles']);
      gulp.watch('./templates/**/*', ['views']);
      gulp.watch(['./rocketbelt/**/*.js'], ['uglify']);
      gulp.watch(config.buildPath + '/**/*.html').on('change', debounce(plugins.browserSync.reload, 500));
      gulp.watch(config.buildPath + '/**/*.js').on('change', debounce(plugins.browserSync.reload, 500));

      global.isWatching = true;

      return true;
    }
  };
})();
