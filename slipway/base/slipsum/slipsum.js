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

  function randomIntFromInterval(min,max)
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  }

  var sentences = function (targetNumSentences) {
    var currentWord = '_START';
    var str = '';

    var numSentences = 0;
    while (numSentences < targetNumSentences) {
      // Follow a random node, append it to the string, and move to that node
      var rand = Math.floor(Math.random() * cache[currentWord].length);
      str += cache[currentWord][rand];

      // No more nodes to follow? Start again. (Add a period to make things look better.)
      if (!cache[cache[currentWord][rand]]) {
        currentWord = '_START';
        if (!cache[currentWord][rand].match(/\.$/)) {
          str += '. ';
          numSentences += 1;
          break;
        }
        else {
          str += ' ';
        }
      }
      else {
        currentWord = cache[currentWord][rand];
        var pattern = /[.!?](\s?)$/g;

        if (currentWord.match(pattern)) {
          var r = Math.floor(Math.random() * 19) + 1;

          if (r === 1) {
            currentWord.replace(pattern, '?!$1');
          }
          else if (r >= 2 && r < 4) {
            currentWord.replace(pattern, '?$1');
          }
          else if (r >= 4 && r < 7) {
            currentWord.replace(pattern, '!$1');
          }

          numSentences += 1;
        }

        if (numSentences !== targetNumSentences) {
          str += ' ';
        }
      }
    }

    return str;
  }

  var paragraphs = function (targetNumParagraphs) {
    var paras = '';

    for (var i = 0; i < targetNumParagraphs; i++) {
      var rand = randomIntFromInterval(4, 8);
      paras += sentences(rand);
      paras += '\n\n';
    }

    paras.replace(/[\s\n]+$/g, '');
    return paras;
  }

  var slipsum = {
    sentences: sentences,
    paragraphs: paragraphs
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
