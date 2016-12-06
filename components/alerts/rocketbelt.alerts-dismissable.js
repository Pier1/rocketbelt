(function () {
  'use strict';

  $(document).ready(function () {
    $('body').on('click', '.message-dismissable .message-dismissable_close',
      function () {
        var $message = $(this).parent();
        $message.toggleClass('slideOutUp');
        $message.one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend',
          function(e) {
            $message.slideUp('300', function () { $message.remove(); });
          }
        );
      }
    );
  });
})();
