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

      callback();
    };

    rb.animate.onAnimationEnd(el, cb, true);
  };

  if ($) {
    const functions = {
      'animate': function animate(animationName, configOrCallback) {
        return this.each(function eachAnimate() {
          return window.rb.animate.animate(this, animationName, configOrCallback);
        });
      },
      'animate.onTransitionEnd': function onTransitionEnd(callback, once = false) {
        return this.each(function eachTransitionEnd() {
          return window.rb.animate.onTransitionEnd(this, callback, once);
        });
      },
      'animate.onAnimationEnd': function onAnimationEnd(callback, once = false) {
        return this.each(function eachAnimationEnd() {
          return window.rb.animate.onAnimationEnd(this, callback, once);
        });
      }
    };

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
