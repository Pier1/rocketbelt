(function (global) {
  'use strict';

  function addClass(elements, myClass) {
    if (!elements) { return; }

    if (typeof(elements) === 'string') {
      elements = document.querySelectorAll(elements);
    }

    // If match is a single DOM element, make it an array to simplify behavior
    else if (elements.tagName) {
      elements=[elements];
    }

    // Add class to all chosen elements
    for (var i = 0; i < elements.length; i++) {
      if ( (' '+elements[i].className+' ').indexOf(' ' + myClass + ' ') < 0 ) {
        elements[i].className += ' ' + myClass;
      }
    }
  }

  function removeClass(elements, myClass) {
    if (!elements) { return; }

    if (typeof(elements) === 'string') {
      elements = document.querySelectorAll(elements);
    }

    // If match is a single DOM element, make it an array to simplify behavior
    else if (elements.tagName) {
      elements=[elements];
    }
    // Create pattern to find class name
    var reg = new RegExp('(^| )'+myClass+'($| )', 'g');

    // Remove class from all chosen elements
    for (var i = 0; i < elements.length; i++) {
      elements[i].className = elements[i].className.replace(reg, ' ');
    }
  }

  // Helper function for dispatching cross browser dispatch events
  // from http://youmightnotneedjquery.com/#trigger_custom
  function dispatchEvent (el, eventName, emmiter) {
    // IE < Edge Polyfill
    // from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    function _CustomEvent (event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    _CustomEvent.prototype = window.Event.prototype;

    var event;

    if (window.CustomEvent && typeof window.CustomEvent === 'function') {
      event = new window.CustomEvent(eventName, { detail: emmiter });
    } else {
      event = new _CustomEvent(eventName, { bubbles: false, cancelable: false, detail: emmiter });
    }

    event && el.dispatchEvent(event);
  }

  // Helper function to get all focusable children from a node
  function getFocusableChildren (node) {
    var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];

    return $$(focusableElements.join(','), node).filter(function (child) {
      return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
    });
  }

  // Helper function to get all nodes in context matching selector as an array
  function $$ (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  // Helper function trapping the tab key inside a node
  function trapTabKey (node, event) {
    var focusableChildren = getFocusableChildren(node);
    var focusedItemIndex = focusableChildren.indexOf(document.activeElement);

    if (event.shiftKey && focusedItemIndex === 0) {
      focusableChildren[focusableChildren.length - 1].focus();
      event.preventDefault();
    } else if (!event.shiftKey && focusedItemIndex === focusableChildren.length - 1) {
      focusableChildren[0].focus();
      event.preventDefault();
    }
  }

  // Helper function to focus first focusable item in node
  function setFocusToFirstItem (node) {
    var focusableChildren = getFocusableChildren(node);
    if (focusableChildren.length) focusableChildren[0].focus();
  }

  var focusedBeforeDialog;

  /**
   * rbDialog constructor
   * @param {Node} node - Dialog element
   * @param {Node} main - Main element of the page
   */
  var rbDialog = function (node, main) {
    main = main || document.querySelector('#main');
    var that = this;
    var openers = $$('[data-rb-dialog-show="' + node.id + '"]');
    var closers = $$('[data-rb-dialog-hide]', node)
      .concat($$('[data-rb-dialog-hide="' + node.id + '"]'));

    if (node.hasAttribute('aria-hidden')) {
      this.shown = !JSON.parse(node.getAttribute('aria-hidden'));
    }

    this.show = show;
    this.hide = hide;
    this.destroy = destroy;

    openers.forEach(function (opener) {
      opener.addEventListener('click', show);
    });

    closers.forEach(function (closer) {
      closer.addEventListener('click', hide);
    });

    function bindKeypress (event) {
      if (that.shown && event.which === 27) {
        event.preventDefault();
        hide(event);
      }

      if (that.shown && event.which === 9) {
        trapTabKey(node, event);
      }
    }

    function maintainFocus (event) {
      var target;
      if (event) {
        if (event.target) {
          target = event.target;
        } else if (event.srcElement) {
          target = event.srcElement;
        }
      }

      if (that.shown && !node.contains(target)) {
        setFocusToFirstItem(node);
      }
    }

    function show () {
      if (that.shown) return;

      that.shown = true;

      addClass(main, 'is-dialog-open');

      node.removeAttribute('aria-hidden');
      main.setAttribute('aria-hidden', 'true');
      focusedBeforeDialog = document.activeElement;
      setFocusToFirstItem(node);
      document.body.addEventListener('focus', maintainFocus, true);
      document.addEventListener('keydown', bindKeypress);
      dispatchEvent(node, 'dialog:show', this);
    }

    function hide (event) {
      if (!that.shown) return;

      var target;
      if (event) {
        if (event.target) {
          target = event.target;
        } else if (event.srcElement) {
          target = event.srcElement;
        }
      }

      if ((event && (event.which === 27 ||
          target.dataset.rbDialogHide !== 'undefined' ||
          target.parentElement.dataset.rbDialogHide !== 'undefined' ||
          target.parentElement.parentElement.dataset.rbDialogHide !== 'undefined'))) {
        that.shown = false;

        removeClass(main, 'is-dialog-open');

        node.setAttribute('aria-hidden', 'true');
        main.removeAttribute('aria-hidden');
        focusedBeforeDialog && focusedBeforeDialog.focus();
        document.body.removeEventListener('focus', maintainFocus, true);
        document.removeEventListener('keydown', bindKeypress);
        dispatchEvent(node, 'dialog:hide', this);
      }
    }

    function destroy () {
      hide();

      openers.forEach(function (opener) {
        opener.removeEventListener('click', show);
      });

      closers.forEach(function (closer) {
        closer.removeEventListener('click', hide);
      });
    }
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = rbDialog;
  } else if (typeof define === 'function' && define.amd) {
    define('rbDialog', [], function () {
      return rbDialog;
    });
  } else if (typeof global === 'object') {
    global.rbDialog = rbDialog;
  }
}(this));

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var dialogs = document.querySelectorAll('.dialog');

    var len = dialogs.length;
    for (var i = 0; i < len; i++) {
      var dialogEl = dialogs[i];
      var obscures = dialogEl.dataset.rbDialogObscures;
      var mainEl = document.getElementById(obscures);

      mainEl.parentNode.insertBefore(dialogEl, mainEl.nextSibling);

      var dialog = new window.rbDialog(dialogEl, mainEl);
    }
  });
}());
