(function ($) {
  $.dynamicButton = function (el) {
    var base = this;
    base.el = el;
    base.$el = $(el);
    base.$el.data('dynamicButton', base);

    base.init = function () {
      base.opts = $.extend({}, $.dynamicButton.defaultOptions);
      base.opts.baseText = base.$el.text() || base.opts.baseText;
      base.opts.busyText = base.$el.data('busy-text') || base.opts.busyText;
      base.opts.successText = base.$el.data('success-text') || base.opts.successText;
      base.opts.failureText = base.$el.data('failure-text') || base.opts.failureText;

      function dynamicElements() {
        var textEl = '<span class="button-state-text">' + base.opts.baseText + '</span>';
        var busyIcon = '<span class="button-state-icon"></span>';
        var newStructure = textEl + busyIcon;

        return newStructure;
      }


      // Build Button DOM
      (base.$el)
      .empty()
        .append(dynamicElements);

      // Init Variables
      var baseText = base.opts.baseText;
      // Because button has to go into a busy state first, we initilize btnClass with "busy" classes
      var btnClass = base.opts.busyText ? 'button-busy button-state-with-text' : 'button-busy';
      var baseWidth = base.$el.outerWidth();

      // Event attachment
      base.$el.on('click buttonActionBusy', function (e) {
        buttonActionBusy.call(this, btnClass, baseWidth);
      });

      base.$el.on('buttonActionComplete', function (e, statusMsg, customDelay) {
        if (statusMsg === 'success') {
          var stateText = base.opts.successText;
        }
        if (statusMsg === 'failure') {
          var stateText = base.opts.failureText;
        }
        buttonActionComplete.call(this, statusMsg, customDelay, btnClass, baseWidth, baseText, stateText);
      });
    };

    base.init();

    function buttonActionBusy(btnClass, baseWidth) {
      // busyClass arg here is determined whether/not busy-state has text
      var btn = $(this),
        textSlot = btn.find('.button-state-text');

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
      var btn = $(this),
        btnStateIcon = btn.find('.button-state-icon'),
        textSlot = btn.find('.button-state-text'),
        delay = customDelay || 0;

      var recognizedMsg = ['success', 'failure'];

      btn.css('min-width', btn.outerWidth());
      btnStateIcon.hide();

      if (recognizedMsg.indexOf(statusMsg) > -1) {
        delay = customDelay || 2000;

        btn.removeClass(btnClass);
        btnClass = stateText ? 'button-state-with-text' : '';
        btnClass += ' button-' + statusMsg;

        btn.css('min-width', baseWidth);
        btn.addClass(btnClass);
        textSlot.text(stateText);
      }

      btnStateIcon.show();

      setTimeout(function () {
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

  $.fn.dynamicButton = function (options) {
    var dynamicButton, method, methodResult;
    if (typeof options === 'string') {
      method = options;
      dynamicButton = this.data('dynamicButton');
      if (dynamicButton) {
        if (dynamicButton.methods[method]) {
          methodResult = dynamicButton.methods[method].apply(dynamicButton, Array.prototype.slice.call(arguments, 1));
        } else {
          console.warn('The method ' + method + ' does not exist in dynamicButton.');
        }
      }
      return methodResult || this;
    }
    return this.each(function () {
      $.data(this, 'dynamicButton') || (new $.dynamicButton(this, options));
    });
  };
})(jQuery);
