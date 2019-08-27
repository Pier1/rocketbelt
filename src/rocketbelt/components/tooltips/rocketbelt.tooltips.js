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

  $(window).on('load resize', function moveTT() {
    let tooltip = $('.tooltip').not('.tooltip-md, .tooltip-lg');

    $(tooltip).each(function () {
      let content = $(this).find('.tooltip-content');

      if ($(content).offset().left < -20 && $(this).hasClass('tooltip-left')) {
        $(this)
          .removeClass('tooltip-left')
          .addClass('tooltip-right');
      } else if (
        $(content).offset().left + $(content).width() > $(window).width() &&
        $(this).hasClass('tooltip-right')
      ) {
        $(this)
          .removeClass('tooltip-right')
          .addClass('tooltip-left');
      } else if ($(content).offset().left < 0 && $(content).offset().left > -20) {
        $(content).css('left', '85%');
      }
    });
  });

  rb.onDocumentReady(decorateTooltipTriggers);
  rb.tooltips = rb.tooltips || {};
  rb.tooltips.decorateTooltipTriggers = decorateTooltipTriggers;
})(window.rb, document);
