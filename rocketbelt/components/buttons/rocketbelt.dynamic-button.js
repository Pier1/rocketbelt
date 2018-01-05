'use strict';
(($ => {
  $.dynamicButton = (el) => {
    const base = this;
    base.el = el;
    base.$el = $(el);
    base.$el.data('dynamicButton', base);

    base.init = () => {
      base.opts = $.extend({}, $.dynamicButton.defaultOptions);
      base.opts.baseText = base.$el.text() || base.opts.baseText;
      base.opts.busyText = base.$el.data('busy-text') || base.opts.busyText;
      base.opts.successText = base.$el.data('success-text') || base.opts.successText;
      base.opts.failureText = base.$el.data('failure-text') || base.opts.failureText;

      function dynamicElements() {
        const textEl = `<span class="button-state-text">${base.opts.baseText}</span>`;
        const busyIcon = '<span class="button-state-icon"></span>';
        const newStructure = textEl + busyIcon;

        return newStructure;
      }


      // Build Button DOM
      (base.$el)
      .empty()
        .append(dynamicElements);

      // Init Variables
      const baseText = base.opts.baseText;
      // Because button has to go into a busy state first, we initilize btnClass with "busy" classes
      const btnClass = base.opts.busyText ? 'button-busy button-state-with-text' : 'button-busy';
      const baseWidth = base.$el.outerWidth();

      // Event attachment
      base.$el.on('click', (e) => {
        buttonActionBusy.call(this, btnClass, baseWidth);
      });

      let stateText = '';
      base.$el.on('buttonActionComplete', (e, statusMsg, customDelay) => {
        if (statusMsg === 'success') {
          stateText = base.opts.successText;
        }
        if (statusMsg === 'failure') {
          stateText = base.opts.failureText;
        }
        buttonActionComplete.call(this, statusMsg, customDelay, btnClass, baseWidth, baseText, stateText);
      });
    };

    base.init();

    function buttonActionBusy(btnClass, baseWidth) {
      // busyClass arg here is determined whether/not busy-state has text
      const btn = $(this);

      const textSlot = btn.find('.button-state-text');

      textSlot.text(base.opts.busyText ? base.opts.busyText : base.opts.baseText);
      btn.prop('disabled', true)
        .css('min-width', baseWidth)
        .addClass(btnClass);

      base.$el.trigger({
        type: 'dynamicButton.busy',
        el: base.el
      });
    }

    function buttonActionComplete(statusMsg, customDelay, btnClass, baseWidth, baseText, stateText) {
      const btn = $(this);
      const btnStateIcon = btn.find('.button-state-icon');
      const textSlot = btn.find('.button-state-text');
      let delay = customDelay || 0;

      const recognizedMsg = ['success', 'failure'];

      btn.css('min-width', btn.outerWidth());
      btnStateIcon.hide();

      if (recognizedMsg.includes(statusMsg)) {
        delay = customDelay || 2000;

        btn.removeClass(btnClass);
        btnClass = stateText ? 'button-state-with-text' : '';
        btnClass += ` button-${statusMsg}`;

        btn.css('min-width', baseWidth);
        btn.addClass(btnClass);
        textSlot.text(stateText);
      }

      btnStateIcon.show();

      setTimeout(() => {
        buttonReset(btn, btnClass, textSlot, baseText);
      }, delay);
    }

    function buttonReset(btn, btnClass, textSlot, baseText) {
      textSlot.text(baseText);
      btn.prop('disabled', false)
        .removeClass(btnClass);
    }
  };

  $.dynamicButton.defaultOptions = {
    baseText: '',
    busyText: null
  };

  $.fn.dynamicButton = (options) => {
    let dynamicButton;
    let method;
    let methodResult;
    if (typeof options === 'string') {
      method = options;
      dynamicButton = this.data('dynamicButton');
      if (dynamicButton) {
        if (dynamicButton.methods[method]) {
          methodResult = dynamicButton.methods[method].apply(dynamicButton, Array.prototype.slice.call(arguments, 1));
        } else {
          console.warn(`The method ${method} does not exist in dynamicButton.`);
        }
      }
      return methodResult || this;
    }
    return this.each(() => {
      $.data(this, 'dynamicButton') || (new $.dynamicButton(this, options));
    });
  };
}))(jQuery);
