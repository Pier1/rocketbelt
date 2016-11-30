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


      // Build Button DOM
      (base.$el).empty().append(addEventEls)

      // Init Variables
      var btnChild = (base.$el).children('.button-state-text');
      var btnClass = base.opts.busyText ? 'button-busy button-busy-with-text' : 'button-busy';

      // Event attachment
      base.$el.on('click', function() {
        buttonActionBusy.call(this, btnChild, btnClass);
      });
      base.$el.on('buttonActionComplete', function(e, msg) {
        buttonActionComplete.call(this, msg, btnChild, base.opts.baseText, btnClass);
      });
    };

    base.init();

    function addEventEls () {
      var textEl = '<span class="button-state-text">' + base.opts.baseText + '</span>';
      var busyIcon = '<span class="button-state-icon"></span>';
      var newStructure = textEl + busyIcon;

      return newStructure;
    }

    function buttonActionBusy(btnChild, btnClass){

      var target = $(this);
      var baseWidth = target.outerWidth()
      btnChild.text(base.opts.busyText ? base.opts.busyText : base.opts.baseText)
      
      target.prop('disabled',true).css('min-width',baseWidth).addClass(btnClass);

        // Sample Event Trigger
        base.$el.trigger({
            type: "dynamicButton.click",
            el: base.el
        });
      }
    };

    function buttonActionComplete (msg, btnChild, btnText, btnClass, e) {
      var btn = $(this);

      if (btn.hasClass('with-success') && msg === 'success') {
        btn.find('.button-state-icon').hide();
        btn.css('min-width',btn.outerWidth());
        btn.removeClass(btnClass);
        btnClass = 'button-success-active';
        btn.addClass(btnClass);
        btn.find('.button-state-icon').show();
        setTimeout(function() {
          buttonReset(btn, btnChild, btnText, btnClass);
        }, 2000);
        return false;
      } else if (msg === 'fail') {
        // fail placeholder
        console.log('fail');
      }

      buttonReset(btn, btnChild, btnText, btnClass);
    }

    function buttonReset (btn, btnChild, btnText, btnClass) {
      btnChild.text(btnText);
      btn.prop('disabled',false).css('min-width', 'auto').removeClass(btnClass);
    }

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