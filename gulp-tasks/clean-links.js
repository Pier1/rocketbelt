'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      const exec = require('child_process').exec;
      return exec('find ' + config.templatesPath +  ' -type l -delete', (err, stdout, stderr) => { });
    };
  };
})();
