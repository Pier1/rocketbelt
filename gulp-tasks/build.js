(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function (done) {
      return plugins.runSequence('uglify', 'link', 'feature-detection', ['styles', 'views'], 'sitemap', done);
    };
  };
})();
