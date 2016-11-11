(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function (done) {
      return plugins.runSequence('build', ['server', 'watch'], done);
    };
  };
})();
