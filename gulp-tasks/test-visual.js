'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      const spawn = require('child_process').spawn;
      const phantomcss = require('phantomcss');
      const moment = require('moment-timezone');

      const config = {
        phantomcssConfig: {
          outputSettings: {
            transparency: 0.3
          }
        }
      };

      plugins.recursiveReaddir('.', ['!rocketbelt/**/tests/*.js'], (err, tests) => {
        const casperChild = spawn('casperjs', ['test', Array.prototype.concat(tests), '--runAt=' + moment().tz('America/Chicago').format('YYYYMMDD-HHmmss')]);

        casperChild.stdout.on('data', (data) => {
          plugins.util.log('CasperJS:', data.toString().slice(0, -1)); // Remove newline
        });

        casperChild.on('close', (code) => {
            let success = code === 0; // Will be 1 in the event of failure
            // Do something with success here
        });
      });

      return true;
    };
  };
})();
