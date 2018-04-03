'use strict';
((window, document) => {
  window.rb = window.rb || {};

  window.rb.keys = {
    ALT: 18,
    ARROWS: [37, 38, 39, 40],
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    BACKSPACE: 8,
    CMD: 91,
    CTRL: 17,
    DELETE: 46,
    END: 35,
    ENTER: 13,
    ESC: 27,
    HOME: 36,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    SHIFT: 16,
    SPACE: 32,
    TAB: 9
  };

  window.rb.focusables =
   'a[href], area[href], input:not([disabled]), select:not([disabled]),' +
   'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex],' +
   '*[contenteditable]';

  const aria = 'aria-';
  window.rb.aria = {
    'current':     `${aria}current`,
    'describedby': `${aria}describedby`,
    'disabled':    `${aria}disabled`,
    'expanded':    `${aria}expanded`,
    'haspopup':    `${aria}haspopup`,
    'hidden':      `${aria}hidden`,
    'invalid':     `${aria}invalid`,
    'label':       `${aria}label`,
    'labelledby':  `${aria}labelledby`,
    'live':        `${aria}live`,
    'role':        'role'
  };

  window.rb.getShortId = function getShortId() {
    // Break the id into 2 parts to provide enough bits to the random number.
    // This should be unique up to 1:2.2 bn.
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    firstPart = (`000${firstPart.toString(36)}`).slice(-3);
    secondPart = (`000${secondPart.toString(36)}`).slice(-3);
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

  // Polyfill for "more correct" CustomEvent support to IE >= 9
  // See https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
  (() => {
    if (typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event, params) {
      const p = params || { bubbles: false, cancelable: false, detail: undefined };
      const evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, p.bubbles, p.cancelable, p.detail);
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    const e = (window.CustomEvent = CustomEvent);

    return e;
  })();

  // Self-removing event listener.
  window.rb.once = (node, type, callback) => {
    node.addEventListener(type, function handler(e) {
      e.target.removeEventListener(e.type, handler);
      return callback(e);
    });
  };

  // Polyfill NodeList.forEach in IE (all versions) and Safari (pre-10).
  // See https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
  ((NodeListProto) => {
    if (window.NodeList && !NodeListProto.forEach) {
      NodeListProto.foreach = (callback, thisArg) => {
        const arg = thisArg || window;
        for (let i = 0; i < this.length; i++) {
          callback.call(arg, this[i], i, this);
        }
      };
    }
  })(window.NodeList.prototype);

  // Polyfill vendor-prefixed Element.matches and Element.closest in IE.
  // See https://github.com/jonathantneal/closest.
  ((ElementProto) => {
    if (typeof ElementProto.matches !== 'function') {
      ElementProto.matches =
        ElementProto.msMatchesSelector ||
        function matches(selector) {
          const element = this;
          const elements = (element.document || element.ownerDocument).querySelectorAll(selector);
          let index = 0;

          while (elements[index] && elements[index] !== element) {
            ++index;
          }

          return Boolean(elements[index]);
        }
      ;
    }

    if (typeof ElementProto.closest !== 'function') {
      ElementProto.closest = (selector) => {
        let element = this;

        while (element && element.nodeType === 1) {
          if (element.matches(selector)) {
            return element;
          }

          element = element.parentNode;
        }

        return null;
      };
    }
  })(window.Element.prototype);
})(window, document);
