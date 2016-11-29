(function($) {
  $.busyButton = function(el) {
    var base = this;
    base.el = el;
    base.$el = $(el);
    base.$el.data("busyButton", base);

    base.init = function(){
      base.opts = $.extend({}, $.busyButton.defaultOptions);
      base.opts.baseText = base.$el.text() || base.opts.baseText;
      base.opts.busyText = base.$el.data('busy-text') || base.opts.busyText;


      // Build Button DOM
      (base.$el).empty().append(addEventEls)

      // Init Variables
      var btnChild = (base.$el).children('.button-busy-text');
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
      var textEl = '<span class="button-busy-text">' + base.opts.baseText + '</span>';
      var busyIcon = '<span class="button-busy-icon"></span>';
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
            type: "busyButton.click",
            el: base.el
        });
      }
    };

    function buttonActionComplete (msg, btnChild, btnText, btnClass, e) {
      var btn = $(this);

      if (btn.hasClass('with-success') && msg === 'success') {
        btn.css('min-width',btn.outerWidth());
        btn.removeClass(btnClass);
        btnClass = 'button-success-active';
        btn.addClass(btnClass);
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
      console.log('reset');
      btnChild.text(btnText);
      btn.prop('disabled',false).css('min-width', 'auto').removeClass(btnClass);
    }

    $.busyButton.defaultOptions = {
        baseText: '',
        busyText: null
    };

    $.fn.busyButton = function(options){
        var busyButton, method, methodResult;
        if ( typeof options === 'string' ){
            method = options;
            busyButton = this.data('busyButton');
            if (busyButton) {
                if (busyButton.methods[method]) {
                    methodResult = busyButton.methods[method].apply(busyButton, Array.prototype.slice.call( arguments, 1 ) );
                } else {
                    console.warn('The method ' + method + ' does not exist in busyButton.');
                }
            }
            return methodResult || this;
        }
        return this.each(function(){
            $.data(this, 'busyButton') || ( new $.busyButton(this, options) );
        });
    };
 
})(jQuery);