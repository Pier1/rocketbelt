'use strict';
((window, document, $) => {
  const rb = window.rb;

  const prefix = 'animation_';
  const animTypes = {
    in: 'in_',
    out: 'out_',
    state: 'state_',
    emphasis: 'emphasis_'
  };

  const getAnimationNames = (inOrOut) => {
    return {
      // Entrances & Exits
      fade:      `${prefix}${inOrOut}fade`,
      slide:     `${prefix}${inOrOut}slide`,
      fadeSlide: `${prefix}${inOrOut}fade-slide`,
      grow:      `${prefix}${inOrOut}grow`,
      shrink:    `${prefix}${inOrOut}shrink`
    };
  };

  rb.animate = rb.animate || {};
  rb.animate.in  = rb.animate.in  || getAnimationNames(animTypes.in);
  rb.animate.out = rb.animate.out || getAnimationNames(animTypes.out);

  rb.animate.state = rb.animate.state || {
    expandCollapse: `${prefix}${animTypes.state}expand-collapse`,
    scale:   `${prefix}${animTypes.state}scale`,
    opacity: `${prefix}${animTypes.state}opacity`,
    color:   `${prefix}${animTypes.state}color`
  };

  rb.animate.emphasis = rb.animate.emphasis || {
    pulse: `${prefix}${animTypes.emphasis}pulse`
  };

  const easingPrefix = `${prefix}easing_`;
  rb.animate.easing = rb.animate.easing || {
    motion: `${easingPrefix}motion`
  };

  const durationPrefix = `${prefix}duration_`;
  rb.animate.duration = rb.animate.duration || {
    xs: `${durationPrefix}xs`,
    sm: `${durationPrefix}sm`,
    md: `${durationPrefix}md`,
    lg: `${durationPrefix}lg`,
    xl: `${durationPrefix}xl`
  };

  rb.animate.onAnimationEnd = (el, callback, once = false) => {
    el.addEventListener('animationend', function animationHandler(e) {
      if (once) {
        e.target.removeEventListener(e.type, animationHandler);
      }

      if (callback) {
        return callback(e);
      }

      return el;
    });
  };

  rb.animate.onTransitionEnd = (el, callback, once = false) => {
    el.addEventListener('transitionend', function transitionHandler(e) {
      if (once) {
        e.target.removeEventListener(e.type, transitionHandler);
      }

      if (callback) {
        return callback(e);
      }

      return el;
    });
  };

  rb.animate.animate = (el, animationName, configOrCallback) => {
    const classesToRemove = ['animatable', animationName];
    let callback = null;
    let resetAfterAnimating = false;
    let isAnimation = !(animationName.includes('expand') || animationName.includes('collapse'));

    if (typeof configOrCallback === 'function') {
      callback = configOrCallback;
    } else if (typeof configOrCallback === 'object') {
      if (configOrCallback.easing) {
        classesToRemove.push(configOrCallback.easing);
      }

      if (configOrCallback.duration) {
        classesToRemove.push(configOrCallback.duration);
      } else {
        // Provide a default duration
        classesToRemove.push(rb.animate.duration.md);
      }

      if (configOrCallback.callback) {
        callback = configOrCallback.callback;
      }

      if (configOrCallback.resetAfterAnimating) {
        resetAfterAnimating = true;
      }
    }

    if (el && el.classList) {
      el.classList.add(...classesToRemove);
    }

    const cb = () => {
      if (resetAfterAnimating && el && el.classList) {
        el.classList.remove(...classesToRemove);
      }

      if (callback) {
        callback();
      }
    };

    if (isAnimation) {
      rb.animate.onAnimationEnd(el, cb, true);
    } else {
      rb.animate.onTransitionEnd(el, cb, true);
    }

    if (animationName.includes('expand') || animationName.includes('collapse')) {
      isAnimation = false;
      expandOrCollapse(el);
    }
  };

  if ($) {
    const functions = {
      /**
       * Add a Rocketbelt animation to a jQuery object.
       *
       * @param  {string} animationName The Rocketbelt animation name.
       * @param  {(object|function)} configOrCallback A configuration object or a callback to run after the animation finishes.
       * @returns {object} A chainable jQuery object.
       */
      'animate': function animate(animationName, configOrCallback) {
        return this.each(function eachAnimate() {
          return window.rb.animate.animate(this, animationName, configOrCallback);
        });
      },

      /**
       * Execute a function after a transition finishes.
       *
       * @param {function} callback The function to execute after the transition.
       * @param {boolean} [once=false] Whether to execute the callback after subsequent transitions. If true, removes the event listener after the first execution of the callback.
       * @returns {object} A chainable jQuery object.
       */
      'animate.onTransitionEnd': function onTransitionEnd(callback, once = false) {
        return this.each(function eachTransitionEnd() {
          return window.rb.animate.onTransitionEnd(this, callback, once);
        });
      },

      /**
       * Execute a function after a transition finishes.
       *
       * @param {function} callback The function to execute after the transition.
       * @param {boolean} [once=false] Whether to execute the callback after subsequent animations. If true, removes the event listener after the first execution of the callback.
       * @returns {object} A chainable jQuery object.
       */
      'animate.onAnimationEnd': function onAnimationEnd(callback, once = false) {
        return this.each(function eachAnimationEnd() {
          return window.rb.animate.onAnimationEnd(this, callback, once);
        });
      }
    };

    /**
     * Rocketbelt helper functions.
     *
     * @param {any} functionAndOptions A Rocketbelt helper function name as a string.
     * @return {any} The value returned by the passed function name.
     */
    $.fn.rb = function $rb(functionAndOptions) {
      if (functions[functionAndOptions]) {
        return functions[functionAndOptions].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof functionAndOptions === 'object' || !functionAndOptions) {
        // console.warn about calling $.rb with no parameters.
      }

      return $.error(`Function ${functionAndOptions} does not exist on jQuery.rb`);
    };
  }

  const expandOrCollapse = (el) => {
    // See https://css-tricks.com/using-css-transitions-auto-dimensions/
    const collapsedDataAttr = 'data-rb-is-collapsed';
    const isCollapsed = el.getAttribute(collapsedDataAttr) === 'true';

    if (isCollapsed) {
      el.addEventListener('transitionend', function onExpandEnd() {
        el.removeEventListener('transitionend', onExpandEnd);
      });

      // Expand
      el.style.height = null;

      // Mark the element as expanded
      el.setAttribute(collapsedDataAttr, 'false');
    } else {
      // Collapse
      const elHeight = el.scrollHeight;

      // Temporarily disable all css transitions
      const elementTransition = el.style.transition;
      el.style.transition = '';

      // On the next frame, explicitly set the element's height to its
      // current pixel height, so we aren't transitioning out of 'auto'
      requestAnimationFrame(() => {
        el.style.height = `${elHeight}px`;
        el.style.transition = elementTransition;

        // On the next frame, have the element transition to height: 0
        requestAnimationFrame(() => {
          el.style.height = '0px';
        });
      });

      // Mark the element as expanded
      el.setAttribute(collapsedDataAttr, 'true');
    }
  };
})(window, document, jQuery);
