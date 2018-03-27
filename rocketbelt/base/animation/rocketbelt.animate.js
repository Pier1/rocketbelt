'use strict';
((window, document, $) => {
  const rb = window.rb;

  const prefix = 'animation_';
  const getAnimationNames = (inOrOut) => {
    return {
      // Entrances & Exits
      fade:      `${prefix}${inOrOut}fade`,
      slide:     `${prefix}${inOrOut}slide`,
      fadeSlide: `${prefix}${inOrOut}fade-slide`,
      expand:    `${prefix}${inOrOut}expand`,
      collapse:  `${prefix}${inOrOut}collapse`,
      grow:      `${prefix}${inOrOut}grow`,
      shrink:    `${prefix}${inOrOut}shrink`,

      // Emphasis
      //
      // State Change
      //
    };
  };

  rb.animate = rb.animate || {};
  rb.animate.in  = rb.animate.in  || getAnimationNames('in_');
  rb.animate.out = rb.animate.out || getAnimationNames('out_');

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

      return callback(e);
    });
  };

  rb.animate.onTransitionEnd = (el, callback, once = false) => {
    el.addEventListener('transitionend', function transitionHandler(e) {
      if (once) {
        e.target.removeEventListener(e.type, transitionHandler);
      }

      return callback(e);
    });
  };

  rb.animate.animate = (el, animationName, configOrCallback) => {
    const classesToRemove = ['animatable', animationName];
    let callback = null;
    let resetAfterAnimating = false;

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

    el.classList.add(...classesToRemove);

    const cb = () => {
      if (resetAfterAnimating) {
        el.classList.remove(...classesToRemove);
      }

      if (callback) {
        callback();
      }
    };

    rb.animate.onAnimationEnd(el, cb, true);
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
})(window, document, jQuery);
