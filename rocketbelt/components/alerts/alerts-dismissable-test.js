(function () {
  'use strict';

  var fs = require('fs');
  var phantomcss = require('phantomcss');

  var currentTestFile = casper.test.currentTestFile;
  var currentPattern  = currentTestFile.replace(/^.*[\\\/]/, '').replace('-test.js', '');
  var currentFsDir    = currentTestFile.substring(0, currentTestFile.lastIndexOf('/'));
  var currentWsDir    = currentFsDir.replace('rocketbelt/', '').replace('templates/', '');
  var runAt = casper.cli.get('runAt');

  casper.test.begin(currentPattern, function(test) {
    phantomcss.init({
      rebase: casper.cli.get('rebase'),
      outputSettings: {
        transparency: 0.3
      },
      screenshotRoot: currentFsDir + '/baseline',
      comparisonResultRoot: currentFsDir + '/diffs',
      fileNameGetter: function(root, filename){
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
    casper.viewport(800, 600);

    casper.then(function() {
      phantomcss.screenshot('.message-dismissable', currentPattern);
    });

    casper.then(function now_check_the_screenshots() {
      phantomcss.compareAll();
    });

    casper.run(function() {
      casper.test.done();
    });
  });
})();
