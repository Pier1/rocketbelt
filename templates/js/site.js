(function () {
  'use strict';

  window.rocketbelt = window.rocketbelt || {};
  window.rocketbelt.getScript = function (url, cb) {
    var body = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = cb;
    script.onload = cb;

    body.appendChild(script);
  };

  $(document).ready(function(){
    var clipboard = new Clipboard('.copy-code');

    clipboard.on('success', function(e) {
        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });

  	var pageTitle = document.title.toLowerCase()
              .replace(' | rocketbelt pattern library', '')
              .replace(/\ & /g," ")
              .replace(/\s+/g,'-');
    $('li.isActive', '#docs-leftnav').removeClass('isActive');
  	$('#docs-leftnav').find('li[ref="' + pageTitle + '"]').addClass('isActive');

    // Mobile heuristic. 48rem == 'md' breakpoint.
    if (!window.matchMedia('(min-width: 48rem)') {
      $('.isActive').parent().siblings('.category-toggle').prop('checked', true);
    }

    $('.nav .category-label').click(function (e) {
      // Mobile heuristic. 48rem == 'md' breakpoint.
      if (!window.matchMedia('(min-width: 48rem)').matches && $(this).siblings('.category-toggle').prop('checked') === false) {
        e.preventDefault();
        $('.nav .category-toggle').prop('checked', false);
        $(this).siblings('.category-toggle').prop('checked', true);
      }
    });
  });
})();
