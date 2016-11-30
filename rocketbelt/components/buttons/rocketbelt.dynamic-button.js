(function($) {
  $.dynamicButton = function(el) {
    var base = this;
    base.el = el;
    base.$el = $(el);
    base.$el.data("dynamicButton", base);

    base.init = function(){
      base.opts = $.extend({}, $.dynamicButton.defaultOptions);
      base.opts.baseText = base.$el.text() || base.opts.baseText;
      base.opts.busyText = base.$el.data('busy-text') || base.opts.busyText;

      function dynamicElements () {
        var textEl = '<span class="button-state-text">' + base.opts.baseText + '</span>';
        var busyIcon = '<span class="button-state-icon"></span>';
        var newStructure = textEl + busyIcon;

        return newStructure;
      }


      // Build Button DOM
      (base.$el).empty().append(dynamicElements);

      // Init Variables
      var baseText = base.opts.baseText;
      var btnClass = base.opts.busyText ? 'button-busy button-busy-with-text' : 'button-busy';

      // Event attachment
      base.$el.on('click', function(e) {
        buttonActionBusy.call(this, btnClass);
      });

      base.$el.on('buttonActionComplete', function(e, statusMsg) {
        buttonActionComplete.call(this, statusMsg, btnClass, baseText);
      });

    };

    base.init();

    function buttonActionBusy(btnClass){
      // busyClass arg here is determined whether/not busy-state has text
      var btn = $(this),
      textSlot = btn.find('button-state-text'),
      baseWidth = btn.outerWidth();
      
      textSlot.text(base.opts.busyText ? base.opts.busyText : base.opts.baseText);
      btn.prop('disabled',true).css('min-width',baseWidth).addClass(btnClass);

      base.$el.trigger({
          type: "dynamicButton.busy",
          el: base.el
       });
    }

    function buttonActionComplete (statusMsg, btnClass, baseText) {
      var btn = $(this),
      btnStateIcon = btn.find('.button-state-icon'),
      btnStateText = btn.find('button-state-text'),
      delay = 0;

      var recognizedMsg = ['success','failure'];

      btnStateIcon.hide();
      btn.css('min-width',btn.outerWidth());

      if (recognizedMsg.indexOf(statusMsg) > -1) {
        delay = 2000;
        btn.removeClass(btnClass);
        btnClass = 'button-' + statusMsg;
        btn.addClass(btnClass);
      }

      btnStateIcon.show();

      setTimeout(function() {
        buttonReset(btn, btnClass, btnStateText, baseText)
      }, delay)
    }

    function buttonReset (btn, btnClass, btnStateText, baseText) {
      btnStateText.text(baseText);
      btn.prop('disabled',false).css('min-width', 'auto').removeClass(btnClass);
    }

  };

    $.dynamicButton.defaultOptions = {
        baseText: '',
        busyText: null
    };

    $.fn.dynamicButton = function(options){
        var dynamicButton, method, methodResult;
        if ( typeof options === 'string' ){
            method = options;
            dynamicButton = this.data('dynamicButton');
            if (dynamicButton) {
                if (dynamicButton.methods[method]) {
                    methodResult = dynamicButton.methods[method].apply(dynamicButton, Array.prototype.slice.call( arguments, 1 ) );
                } else {
                    console.warn('The method ' + method + ' does not exist in dynamicButton.');
                }
            }
            return methodResult || this;
        }
        return this.each(function(){
            $.data(this, 'dynamicButton') || ( new $.dynamicButton(this, options) );
        });
    };
 
})(jQuery);