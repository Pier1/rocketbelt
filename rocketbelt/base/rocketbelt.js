(function rocketbelt(window, document) {
  window.rb = window.rb || {};

  window.rb.getShortId = function getShortId() {
    // Break the id into 2 parts to provide enough bits to the random number.
    // This should be unique up to 1:2.2 bn.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ('000' + firstPart.toString(36)).slice(-3);
    secondPart = ('000' + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  };

  window.rb.onDocumentReady = function onDocumentReady(fn) {
    if (
      document.readyState === 'complete' ||
      (document.readyState !== 'loading' && !document.documentElement.doScroll)
    ) {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };

  window.rb.aria = {
    'current':     'aria-current',
    'describedby': 'aria-describedby',
    'disabled':    'aria-disabled',
    'expanded':    'aria-expanded',
    'haspopup':    'aria-haspopup',
    'hidden':      'aria-hidden',
    'invalid':     'aria-invalid',
    'label':       'aria-label',
    'labelledby':  'aria-labelledby',
    'live':        'aria-live',
    'role':        'role'
  };
})(window, document);
