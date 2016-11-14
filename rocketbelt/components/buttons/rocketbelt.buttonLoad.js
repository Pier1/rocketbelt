(function($) {
  $.buttonLoad = function(el) {
    var base = this;
    base.el = el;
    base.$el = $(el);
    base.$el.data("buttonLoad", base);

    base.init = function(){
        base.opts = $.extend({}, $.buttonLoad.defaultOptions);
        base.opts.baseText = base.$el.text() || base.opts.baseText;
        base.opts.stateText = base.$el.data('state_text') || base.opts.stateText;


        // Build Button DOM
        addEventEls();


        // Event attachment
        base.$el.on('click', clickHandlerFunction);
    };

    base.init();

    function addEventEls (opts) {
      var baseEl = base.$el;
      var textEl = '<span class="btn-text">' + base.opts.baseText + '</span>';
      var stateIcon = '<span class="btn_icon"></span>';
      var newStructure = textEl + stateIcon;

      $(baseEl).empty().append(newStructure);
    }

    function clickHandlerFunction(event){

        // Sample Event Trigger
        base.$el.trigger({
            type: "buttonLoad.click",
            relatedElement: base.el
        });
    }

    function otherPrivateFunction(evt){
        // ...
    }

    /*---  PUBLIC FUNCTIONS   ---*/
    //  Called like $('element').buttonLoad('destroy');

    function destroy(){
      base.$el.removeData("buttonLoad");

      // Remove event handling
      base.$el.off('click', clickHandlerFunction);
    }

    function otherPublicFunction(evt){
      // ...
    }

        // Expose public methods
        this.methods = {
            pFunk: otherPublicFunction,
            destroy: destroy
        };
        /*--- END PUBLIC FUNCTIONS ---*/
    };

    $.buttonLoad.defaultOptions = {
        baseText: 'Button',
        stateText: 'Loading'
    };

    $.fn.buttonLoad = function(options){
        var buttonLoad, method, methodResult;
        if ( typeof options === 'string' ){
            method = options;
            buttonLoad = this.data('buttonLoad');
            if (buttonLoad) {
                if (buttonLoad.methods[method]) {
                    methodResult = buttonLoad.methods[method].apply(buttonLoad, Array.prototype.slice.call( arguments, 1 ) );
                } else {
                    // OPTIONAL: Silent
                    // methodResult = null;

                    // Soft Warning
                    console.warn('The method ' + method + ' does not exist in buttonLoad.');

                    // OPTIONAL: Strict Error
                    // throw 'The method ' + method + ' does not exist in buttonLoad.';
                }
            }
            return methodResult || this;
        }
        return this.each(function(){
            $.data(this, 'buttonLoad') || ( new $.buttonLoad(this, options) );
        });
    };
 
})(jQuery);