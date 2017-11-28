(function rocketbeltTooltips(rb, document) {
  function decorateTooltipTriggers() {
    var triggers = document.querySelectorAll('.tooltip_trigger');
    var triggersLen = triggers.length;

    for (var i = 0; i < triggersLen; i++) {
      var trigger = triggers[i];
      var ttContent = trigger.parentNode.querySelector('.tooltip-content');

      if (ttContent) {
        var id = ttContent.id;

        if (!id) {
          id = 'rb-a11y_' + rb.getShortId();
          ttContent.id = id;
        }

        trigger.setAttribute(rb.aria.describedby, id);
        ttContent.setAttribute('role', 'tooltip');
      }
    }
  }

  rb.onDocumentReady(decorateTooltipTriggers);
  rb.tooltips = rb.tooltips || {};
  rb.tooltips.decorateTooltipTriggers = decorateTooltipTriggers;
})(window.rb, document);
