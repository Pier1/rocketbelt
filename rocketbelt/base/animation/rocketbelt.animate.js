'use strict';
((window, document) => {
  window.rb.animate = window.rb.animate || {};

  window.rb.animate.getAnimationEndName = () => {
    const wkae = 'webkitAnimationEnd';
    const ae = 'animationend';
    let name;

    if (wkae in document.body.style) {
      name = wkae;
    } else {
      name = ae;
    }

    window.rb.animate.animationEndName = name;
    return name;
  };

  window.rb.animate.getTransitionEndName = () => {
    const wkte = 'webkitTransitionEnd';
    const te = 'transitionend';
    let name;

    if (wkte in document.body.style) {
      name = wkte;
    } else {
      name = te;
    }

    window.rb.animate.transitionEndName = name;
    return name;
  };

  window.rb.animate.onAnimationEnd = (el, callback, once = false) => {
    const animationend =
      window.rb.animate.animationEndName || window.rb.animate.getAnimationEndName();

    el.addEventListener(animationend, function handler(e) {
      if (once) {
        e.target.removeEventListener(e.type, handler);
      }

      return callback(e);
    });
  };

  window.rb.animate.onTransitionEnd = (el, callback, once = false) => {
    const transitionend =
      window.rb.animate.transitionEndName || window.rb.animate.getTransitionEndName();

    el.addEventListener(transitionend, function handler(e) {
      if (once) {
        e.target.removeEventListener(e.type, handler);
      }

      return callback(e);
    });
  };
})(window, document);
