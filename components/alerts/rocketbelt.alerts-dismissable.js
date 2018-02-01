'use strict';
(() => {
  $(document).ready(() => {
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
  });
})();
