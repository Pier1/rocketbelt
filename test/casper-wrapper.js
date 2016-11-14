(function () {
  'use strict';

  module.exports = {
    wrap: function (perPatternActions) {
      var currentTestFile = casper.test.currentTestFile;
      var currentPattern  = currentTestFile.replace(/^.*[\\\/]/, '').replace('.js', '');
      var currentFsDir    = currentTestFile.substring(0, currentTestFile.lastIndexOf('/'));
      var currentWsDir    = currentFsDir.replace('rocketbelt/', '').replace('templates/', '').replace('/tests', '');

      var phantomcss = require('phantomcss');

      casper.test.begin(currentPattern, function(test) {
        phantomcss.init({
          rebase: casper.cli.get('rebase'),
          outputSettings: {
            transparency: 0.3
          },
          screenshotRoot: currentFsDir + '/baseline',
          comparisonResultRoot: currentFsDir + '/diffs',
          fileNameGetter: function(root, filename){
            var fs = require('fs');
            var runAt = casper.cli.get('runAt');
            var name = root + '/' + filename;

            if (fs.isFile(name + '.png')) {
                return name + '.diff.' + runAt + '.png';
            }
            else {
                return name + '.' + runAt + '.png';
            }
          }
        });

        casper.start('http://localhost:8080/' + currentWsDir);

        perPatternActions(currentPattern);

        casper.then(function now_check_the_screenshots() {
          phantomcss.compareAll();
        });

        casper.run(function() {
          casper.test.done();
        });
      });
    }
  };
})();
