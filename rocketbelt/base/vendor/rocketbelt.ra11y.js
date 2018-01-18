'use strict';
((a11y, module, define) => {
  const A11yState = function A11yState() {
    const self = this;

    // Toggle for suppressing output
    this.suppressWarnings = false;

    this.states = {
      'busy': {
        'used': true,
        'value': [
          true,
          false
        ]
      },
      'checked': {
        'used': ['option'],
        'value': [
          true,
          false,
          'mixed',
          undefined
        ]
      },
      'disabled': {
        'used': true,
        'value': [
          true,
          false
        ]
      },
      'expanded': {
        'used': [
          'button',
          'document',
          'link',
          'section',
          'sectionhead',
          'separator',
          'window'
        ],
        'value': [
          true,
          false,
          undefined
        ]
      },
      'grabbed': {
        'used': true,
        'value': [
          true,
          false,
          undefined
        ]
      },
      'hidden': {
        'used': true,
        'value': [
          true,
          false
        ]
      },
      'invalid': {
        'used': true,
        'value': [
          true,
          false,
          'grammar',
          'spelling'
        ]
      },
      'pressed': {
        'used': ['button'],
        'value': [
          true,
          false,
          'mixed',
          undefined
        ]
      },
      'selected': {
        'used': [
          'gridcell',
          'option',
          'row',
          'tab'
        ],
        'value': [
          true,
          false,
          undefined
        ]
      }
    };

    // State Validation
    this.validate = {
      'state': (state, suppress) => {
        if (Object.keys(self.states).indexOf(state) === -1) {
          if (suppress !== true && !self.suppressWarnings) {
            console.error(`\`${state}\` is not a valid ARIA state`);
          }

          return false;
        }

        return true;
      },
      'value': (state, value, suppress) => {
        let val;
        if (self.validate.state(state)) {
          val = self.states[state].value;

          if (val.indexOf(value) === -1) {
            if (suppress !== true && !self.suppressWarnings) {
              console.error(`\`${value}\` is not a valid value for \`aria-${state}\``);
            }

            return false;
          }

          return true;
        }

        return false;
      }
    };

    // Gets the current state of the ARIA attribute
    this.get = (el, attr) => {
      return el.getAttribute(`aria-${attr}`);
    };

    // Has the current ARIA state
    this.has = (el, attr) => {
      const state = self.get(el, attr);
      if (state === null) {
        return false;
      } else if (state === false || state === 'false') {
        return false;
      }

      return true;
    };

    // Sets the given state
    this.set = (el, state, val) => {
      let newVal = val;
      if (val === undefined) {
        newVal = true;
      } else if (!self.validate.value(state, newVal)) {
        newVal = null;
      }

      if (val !== null) {
        el.setAttribute(`aria-${state}`, newVal);
      }
    };

    // Toggles a given state
    this.toggle = (el, state) => {
      const current = self.get(el, state);

      if (current === null || current === 'false') {
        self.set(el, state, true);
      } else if (current === 'true') {
        self.set(el, state, false);
      } else if (!self.suppressWarnings) {
        console.warn(`Cannot toggle \`aria-${state}\` as its starting value is not a boolean \
          (it\'s \`${current}\`)`);
      }
    };

    // Removes a given state
    this.remove = (el, state) => {
      if (self.validate.value(state, undefined, true)) {
        el.removeAttribute(`aria-${state}`);
      } else {
        el.setAttribute(`aria-${state}`, false);
      }
    };
  };

  window.rb.a11y = window.rb.a11y || {};
  window.rb.a11y.state = new A11yState();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = a11y;
  } else if (typeof define === 'function' && define.amd) {
    define(() => {
      return a11y;
    });
  } else {
    window.a11y = a11y;
  }
})(window.a11y, window.module, window.define);
