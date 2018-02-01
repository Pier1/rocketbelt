'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      return gulp.src(config.buildPath + '/**/*.html', {
        read: false
      })
        .pipe(plugins.sitemap({
          siteUrl: 'http://rocketbelt.design/'
        }))
        .pipe(gulp.dest(config.buildPath));
    };
  };
})();
