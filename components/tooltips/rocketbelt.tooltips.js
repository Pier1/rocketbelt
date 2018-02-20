'use strict';
((rb, document) => {
  function decorateTooltipTriggers() {
    const triggers = document.querySelectorAll('.tooltip_trigger');
    const triggersLen = triggers.length;

    for (let i = 0; i < triggersLen; i++) {
      const trigger = triggers[i];
      const ttContent = trigger.parentNode.querySelector('.tooltip-content');

      if (ttContent) {
        let id = ttContent.id;

        if (!id) {
          id = `rb-a11y_${rb.getShortId()}`;
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
