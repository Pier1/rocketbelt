(function () {
  'use strict';

  window.slipway = window.slipway || {};
  window.slipway.modals = window.slipway.modals || {};
  window.slipway.modals.max = window.slipway.modals.max || {};

  $(document).ready(function () {
    $('a[href="#modal-example-max"]').click(
      function (e) {
        window.slipway.modals.max.pos = window.slipway.modals.max.pos || {};

        if (typeof window.slipway.modals.max.pos.x !== 'undefined') {
          window.slipway.modals.max.pos = null;
        }
        else {
          e.preventDefault();
          window.slipway.modals.max.pos = {
            x: e.clientX,
            y: e.clientY
          };

          $('.modal-max.modal-is-opening')
            .css(
              {
                'transform-origin':
                  window.slipway.modals.max.pos.x + 'px ' +
                  window.slipway.modals.max.pos.y + 'px'
              }
            );
          $(e.currentTarget).trigger('click');
        }
      }
    );
  });
})();
