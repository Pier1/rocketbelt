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
  	var pageTitle = document.title.toLowerCase().replace(' | slipway pattern library', '').replace(/\s+/g,'-');
  	$('li.isActive', '#docs-leftnav').removeClass('isActive');
  	$('#docs-leftnav').find('li[ref="' + pageTitle + '"]').addClass('isActive');
  })
})();
