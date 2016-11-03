// playground.jquery.js

(function($) {
    $.playground = function(el, options) {
        var base = this;

        base.init = function(){
        	base.$el = $(el);
        	base.el = el;
        	base.$el.data("playground", base);

            base.opts = $.extend({}, $.playground.defaultOptions, options);

            if ( base.opts.wrapper ) {
                base.$targetEl = $(base.opts.target || base.$el.data('target'), base.$el.closest(base.opts.wrapper));
            } else {
                base.$targetEl = $(base.opts.target || base.$el.data('target') );
            }

            if ( base.$el.attr("type").toLowerCase() === 'range' ) {
                base.initRange();
            } else {
                base.initText();
            }
            
            // Event attachment
            base.$el.on('input', updateTarget);

            // Set Default
			updateTarget(base.$el.val());

            // Sample callback on init execution
            if (base.opts.init) {
                base.opts.init.call(this, base);
            }
        }

        base.initRange = function(){
            var temp;
            base.type = 'range';
            base.opts.property = base.opts.property || base.$el.data('property');
            base.opts.units = base.opts.units || base.$el.data('units') || '';
            base.$valueEl = base.$el.next('.playground-range-value');
            
            if ( !base.opts.values && base.$el.data('values')) {
                base.opts.values = [];
                temp = base.$el.data('values').replace(/(?:^\[)|(?:\]$)|(?:\s+)/g,'').split(/,|;/);
                temp.forEach(function(vo){
                    var parts = vo.split(':');
                    base.opts.values.push({
                        display: parts[0] + base.opts.units,
                        value: parts[1] || parts[0] + base.opts.units
                    });
                });
            }

            if ( $.isPlainObject(base.opts.values)) {
                temp = [];
                for (var v in base.opts.values) {
                    temp.push({
                        display: v,
                        value: base.opts.values[v]
                    });
                }
                base.opts.values = temp;
            }

            if ( base.opts.values ) {
                base.$el.attr('min',0);
                base.$el.attr('max',base.opts.values.length-1);
                base.$el.attr('step', 1);
            }
        };

        base.initText = function(){
            base.type = 'text';
        };

        base.init();

        function updateTarget(){
        	var val, display, idx;

        	if ( arguments[0].type === 'input' ) {
        		idx = arguments[0].currentTarget.value;
        	} else {
        		idx = arguments[0];
        	}

            if ( base.type === 'range' ) {
                idx = Math.floor(idx);
                if ( base.opts.values && base.opts.values.length ) {
                    display = base.opts.values[idx].display;
                    val = base.opts.values[idx].value;
                } else {
                    val = idx + base.opts.units;
                    display = val;
                }
                if (base.opts.property === 'class') {
                    base.$targetEl.removeClass(base.currentValue).addClass(val);
                } else {
                    base.$targetEl.css(base.opts.property, val);
                }
                base.currentValue = val;
                base.currentDisplay = display;
                updateDisplayedValue();
            } else {
                base.currentValue = idx;
                base.currentDisplay = base.opts.textTransform ? base.opts.textTransform(idx) : idx;
                base.$targetEl.html(base.currentDisplay);
            }
        	
        	// Event trigger
            base.$el.trigger({
                type: "playgroundUpdated",
                element: base.el,
                targetElement: base.$targetEl
            });
        }

        function updateDisplayedValue(){
        	if (!base.$valueEl || !base.$valueEl.length ) return;
        	base.$valueEl.html(base.currentDisplay);
        }

        function destroy(){
            base.$el.removeData("playground");

            // Remove event handling
            base.$el.off('input', updateTarget);
        }

        // Expose public methods
        // Called like $('element').playground('destroy')

        this.methods = {
            destroy: destroy
        };
    };

    $.playground.defaultOptions = {
        target: null,
        units: '',
        wrapper: null,
        values: null,
        init: null,
        textTransform: null
    };

    $.fn.playground = function(options){
        var playground, method, methodResult;
        if ( typeof options == 'string' ){
            method = options;
            playground = this.data('playground');
            if (playground) {
                if (playground.methods[method]) {
                    methodResult = playground.methods[method].apply(playground, Array.prototype.slice.call( arguments, 1 ) );
                } else {
                    methodResult = 'The method ' + method + ' does not exist in playground.';
                }
            }
            return methodResult || this;
        }
        return this.each(function(){
            $.data(this, 'playground') || ( new $.playground(this, options) );
        });
    };

})(jQuery);
