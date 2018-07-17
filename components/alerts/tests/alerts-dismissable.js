(function () {
  'use strict';

  var phantomcss = require('phantomcss');
  var wrapper = require('../../../test/casper-wrapper');

  wrapper.wrap(function (currentPattern) {
    casper.then(function() {
      phantomcss.screenshot('.message-dismissable', currentPattern);
    });
  })
})();
