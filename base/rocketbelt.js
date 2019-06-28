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
    'posinset':    `${aria}posinset`,
    'role':        'role',
    'setsize':     `${aria}setsize`
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

  // See https://stackoverflow.com/a/5100158
  window.rb.dataURItoBlob = (dataURI) => {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    const ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  };

  // Throttle super-chatty events with requestAnimationFrame for better performance.
  // See https://developer.mozilla.org/en-US/docs/Web/Events/resize
  window.rb.throttle = (type, name, obj) => {
    obj = obj || window;
    let running = false;
    const func = () => {
      if (running) { return; }
      running = true;

      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  window.rb.throttle('resize', 'rb.optimizedResize');
  window.rb.throttle('scroll', 'rb.optimizedScroll');

  // Polyfill String.prototype.repeat for IE11. This block can be deleted when
  // IE11 support is no longer needed in the future.
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
  (() => {
    if (!String.prototype.repeat) {
      /* eslint-disable */
      String.prototype.repeat = function repeat(count) {
        if (this == null) {
          throw new TypeError('can\'t convert ' + this + ' to object');
        }
        var str = '' + this;
        count = +count;
        if (count != count) {
          count = 0;
        }
        if (count < 0) {
          throw new RangeError('repeat count must be non-negative');
        }
        if (count == Infinity) {
          throw new RangeError('repeat count must be less than infinity');
        }
        count = Math.floor(count);
        if (str.length == 0 || count == 0) {
          return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the
        // main part. But anyway, most current (August 2014) browsers can't handle
        // strings 1 << 28 chars or longer, so:
        if (str.length * count >= 1 << 28) {
          throw new RangeError('repeat count must not overflow maximum string size');
        }
        var rpt = '';
        for (var i = 0; i < count; i++) {
          rpt += str;
        }
        return rpt;
      }
    }
    /* eslint-enable */
  })();

  // Polyfill NodeList.forEach in IE (all versions) and Safari (pre-10).
  // See https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
  ((NodeListProto) => {
    if (window.NodeList && !NodeListProto.forEach) {
      NodeListProto.forEach = (callback, thisArg) => {
        const arg = thisArg || window;
        for (let i = 0; i < this.length; i++) {
          callback.call(arg, this[i], i, this);
        }
      };
    }
  })(window.NodeList.prototype);

  // Polyfill vendor-prefixed Element.matches and Element.closest in IE.
  // See https://github.com/jonathantneal/closest.
  (() => {
    if (!Element.prototype.closest) {
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
      }
      Element.prototype.closest = function (s) {
        let el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
  })();

  // polyfill for Array.from() function in IE11:
  // Production steps of ECMA-262, Edition 6, 22.1.2.1
  (() => {
    if (!Array.from) {
      Array.from = (function () {
        const toStr = Object.prototype.toString;
        const isCallable = function (fn) {
          return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        const toInteger = function (value) {
          const number = Number(value);
          if (isNaN(number)) { return 0; }
          if (number === 0 || !isFinite(number)) { return number; }
          return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        const maxSafeInteger = Math.pow(2, 53) - 1;
        const toLength = function (value) {
          const len = toInteger(value);
          return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike/* , mapFn, thisArg */) {
          // 1. Let C be the this value.
          const C = this;

          // 2. Let items be ToObject(arrayLike).
          const items = Object(arrayLike);

          // 3. ReturnIfAbrupt(items).
          if (arrayLike === null) {
            throw new TypeError('Array.from requires an array-like object - not null or undefined');
          }

          // 4. If mapfn is undefined, then let mapping be false.
          const mapFn = arguments.length > 1 ? arguments[1] : void undefined;
          let T;
          if (typeof mapFn !== 'undefined') {
            // 5. else
            // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
            if (!isCallable(mapFn)) {
              throw new TypeError('Array.from: when provided, the second argument must be a function');
            }

            // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 2) {
              T = arguments[2];
            }
          }

          // 10. Let lenValue be Get(items, "length").
          // 11. Let len be ToLength(lenValue).
          const len = toLength(items.length);

          // 13. If IsConstructor(C) is true, then
          // 13. a. Let A be the result of calling the [[Construct]] internal method
          // of C with an argument list containing the single item len.
          // 14. a. Else, Let A be ArrayCreate(len).
          const A = isCallable(C) ? Object(new C(len)) : new Array(len);

          // 16. Let k be 0.
          let k = 0;
          // 17. Repeat, while k < len… (also steps a - h)
          let kValue;
          while (k < len) {
            kValue = items[k];
            if (mapFn) {
              A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
            } else {
              A[k] = kValue;
            }
            k += 1;
          }
          // 18. Let putStatus be Put(A, "length", len, true).
          A.length = len;
          // 20. Return A.
          return A;
        };
      }());
    }
  })();
})(window, document);
