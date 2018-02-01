'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return (done) => {
      return plugins.runSequence('uglify', 'link', 'feature-detection', ['styles', 'views', 'copy-tools'], 'sitemap', done);
    };
  };
})();
