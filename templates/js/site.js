(function () {
  'use strict';

  var clipboard = new Clipboard('.copy-code');

  clipboard.on('success', function(e) {
      e.clearSelection();
  });

  clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
  });

  $(document).ready(function(){
  	var pageTitle = document.title.toLowerCase()
              .replace(' | rocketbelt pattern library', '')
              .replace(/\ & /g," ")
              .replace(/\s+/g,'-');
    $('li.isActive', '#docs-leftnav').removeClass('isActive');
  	$('#docs-leftnav').find('li[ref="' + pageTitle + '"]').addClass('isActive');

    $('.nav .category-label').click(function (e) {
      // Mobile heuristic. 48rem == 'md' breakpoint.
      if (!window.matchMedia('(min-width: 48rem)').matches) {
        e.preventDefault();
        $('.nav .category-toggle').prop('checked', false);
        $(this).siblings('.category-toggle').prop('checked', true);
      }
    });
  })
})();
