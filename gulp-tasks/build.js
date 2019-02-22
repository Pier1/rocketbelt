'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return (done) => {
      return plugins.runSequence('uglify', 'link', ['styles', 'views', 'copy-tools'], done);
    };
  };
})();
