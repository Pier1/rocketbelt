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

    const shiftTooltipOnscreen = (el) => {
      const cl = el.classList;
      const direction = cl.contains('tooltip-bottom')
        ? 'bottom'
        : cl.contains('tooltip-left')
        ? 'left'
        : cl.contains('tooltip-right')
        ? 'right'
        : 'top';

      const tooltipContent = $(el).find('.tooltip-content')[0];
      const offscreen = rb.distanceOffscreen(tooltipContent);
      const defaultMargin = '1rem';
      let offset;

      // For top/bottom, adjust min-width 10-20px at a time and check
      // distanceOffscreen. If the min-width ends up as wide as the viewport,
      // flip the side the tooltip is on.

      if (offscreen.top < 0) {
        $(el).addClass('js-tooltip-bottom');
      }
      if (offscreen.right < 0) {
        if (direction === 'right' || direction === 'left') {
          $(el).addClass('js-tooltip-top');
        } else {
          offset = Math.abs(Math.round(offscreen.right));
          $(tooltipContent).css(
            'left',
            `calc(50% - ${offset}px - ${defaultMargin})`
          );
        }
      }
      if (offscreen.bottom < 0) {
        $(el).addClass('js-tooltip-top');
      }
      if (offscreen.left < 0) {
        if (direction === 'right' || direction === 'left') {
          $(el).addClass('js-tooltip-top');
        } else {
          offset = Math.abs(Math.round(offscreen.left));
          $(tooltipContent).css(
            'left',
            `calc(50% + ${offset}px + ${defaultMargin})`
          );
        }
      }
    };

    $('.tooltip').on(
      {
        mouseenter: (e) => {
          const tooltipContent = $(e.target).closest('.tooltip')[0];
          shiftTooltipOnscreen(tooltipContent);
        },
        click: (e) => {
          const tooltipContent = $(e.target).closest('.tooltip')[0];
          shiftTooltipOnscreen(tooltipContent);
        },
        mouseleave: (e) => {
          $(e.target)
            .closest('.tooltip')
            .css({
              top: '',
              right: '',
              bottom: '',
              left: '',
            });
        },
        blur: (e) => {
          $(e.target)
            .closest('.tooltip')
            .css({
              top: '',
              right: '',
              bottom: '',
              left: '',
            });
        },
      },
      '.tooltip_trigger'
    );
  }

  $(window).on('load resize', function moveTT() {
    let tooltip = $('.tooltip').not('.tooltip-md, .tooltip-lg');

    $(tooltip).each(function() {
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
      } else if (
        $(content).offset().left < 0 &&
        $(content).offset().left > -20
      ) {
        $(content).css('left', '85%');
      }
    });
  });

  rb.onDocumentReady(decorateTooltipTriggers);
  rb.tooltips = rb.tooltips || {};
  rb.tooltips.decorateTooltipTriggers = decorateTooltipTriggers;
})(window.rb, document);
