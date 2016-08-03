(function () {
  'use strict';

  // var fs = require('fs');

  var cache = require('./slipsum-cache.json', 'utf-8');

  // var buildCache = function () {
  //   if (cache) {
  //     return;
  //   }
  //   else {
  //     cache = {
  //       '_START': []
  //     }
  //   }
  //
  //   // Get the source text and split it into words
  //   var text = fs.existsSync('./slipsum-seed.txt') ?
  //     fs.readFileSync('./slipsum-seed.txt', 'utf-8').split(/\s+/g) :
  //     null
  //   ;
  //
  //   if (!text) {
  //     return;
  //   }
  //
  //   // Add it to the start node's list of possibility
  //   cache['_START'].push(text[0]);
  //
  //   // Go through each word and add it to the previous word's node
  //   for (var i = 0; i < text.length - 1; i++) {
  //     if (!cache[text[i]]) {
  //       cache[text[i]] = [];
  //     }
  //
  //     cache[text[i]].push(text[i + 1]);
  //
  //     // If it's the beginning of a sentence, add the next word to the start node too
  //     if (text[i].match(/\.$/)) {
  //       cache['_START'].push(text[i + 1]);
  //     }
  //
  //     if (i === (text.length-2)) {
  //       fs.writeFile('./slipsum-cache.json', JSON.stringify(cache, null, 2));
  //     }
  //   }
  // };

  var slipsum = function (numSentences) {
    // Start with the root node
    var currentWord = '_START';
    var str = '';

    // Generate 300 words of text
    for (var i = 0; i < 300; i++) {
      // Follow a random node, append it to the string, and move to that node
      var rand = Math.floor(Math.random() * cache[currentWord].length);
      str += cache[currentWord][rand];

      // No more nodes to follow? Start again. (Add a period to make things look better.)
      if (!cache[cache[currentWord][rand]]) {
        currentWord = '_START';
        if (!cache[currentWord][rand].match(/\.$/)) {
          str += '. ';
        }
        else {
          str += ' ';
        }
      }
      else {
        currentWord = cache[currentWord][rand];
        str += ' ';
      }
    }

    return str;
  }

  module.exports = {
    slipsum: slipsum
  }

  if (typeof exports !== 'undefined') {
    if(typeof module !== 'undefined' && module.exports) {
      exports = module.exports = slipsum;
    }
    exports.slipsum = slipsum;
  }
  else {
    root.slipsum = slipsum;
  }
}).call(this);
