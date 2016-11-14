(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      var spawn = require('child_process').spawn;
      var phantomcss = require('phantomcss');
      var moment = require('moment-timezone');

      var config = {
        phantomcssConfig: {
          outputSettings: {
            transparency: 0.3
          }
        }
      };

      plugins.recursiveReaddir('.', ['!rocketbelt/**/*-test.js'], function (err, tests) {
        var casperChild = spawn('casperjs', ['test', Array.prototype.concat(tests), '--runAt=' + moment().tz('America/Chicago').format('YYYYMMDD-HHmmss')]);

        casperChild.stdout.on('data', function (data) {
          plugins.util.log('CasperJS:', data.toString().slice(0, -1)); // Remove newline
        });

        casperChild.on('close', function (code) {
            var success = code === 0; // Will be 1 in the event of failure
            // Do something with success here
        });
      });

      return true;
    };
  };
})();
