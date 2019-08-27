'use strict';
((window, document, $) => {
  const rb = window.rb;
  const decorateAlerts = () => {
    $('body').on('click', '.message-dismissable .message-dismissable_close',
      (e) => {
        const $message = $(e.target).parent();
        $message.toggleClass('slideOutUp');
        $message.one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend',
          () => {
            $message.slideUp('300', () => { $message.remove(); });
          }
        );
      }
    );

    const aria = rb.aria;

    const closeButtons = document.querySelectorAll('.message-dismissable_close');
    closeButtons.forEach(closeButton => {
      if (closeButton.nodeName.toLowerCase() !== 'button') {
        closeButton.setAttribute('role', 'button');
        closeButton.setAttribute('tabindex', '0');
      }

      closeButton.setAttribute(aria.label, 'Close');
    });
  };

  rb.onDocumentReady(decorateAlerts);
  rb.alerts = rb.alerts || {};
  rb.alerts.decorateAlerts = decorateAlerts;
})(window, document, jQuery);
