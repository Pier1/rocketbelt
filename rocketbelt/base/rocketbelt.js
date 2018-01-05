'use strict';
((window, document) => {
  window.rb = window.rb || {};

  window.rb.getShortId = function getShortId() {
    // Break the id into 2 parts to provide enough bits to the random number.
    // This should be unique up to 1:2.2 bn.
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
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

  // Adds "more correct" CustomEvent support to IE >= 9
  // See https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
  (() => {
    if (typeof window.CustomEvent === 'function' ) return false;

    function CustomEvent(event, params) {
      const p = params || { bubbles: false, cancelable: false, detail: undefined };
      const evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, p.bubbles, p.cancelable, p.detail );
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    const e = (window.CustomEvent = CustomEvent);

    return e;
  })();

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
