var rb = rb || {};
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

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  $(document).ready(function(){
  	var pageTitle = document.title.toLowerCase()
              .replace(' | rocketbelt pattern library', '')
              .replace(/\ & /g," ")
              .replace(/\s+/g,'-');
    $('li.isActive', '#docs-leftnav').removeClass('isActive');
  	$('#docs-leftnav').find('li[ref="' + pageTitle + '"]').addClass('isActive');

    // Play Gifs
    $('img.gipho').on('click', function(){
      var $img = $(this), 
        playSrc = $img.attr('data-play'),
          rand = ( playSrc.indexOf('?') > -1 ? '&' : '?' ) + (Math.random() * 1000|0);
      $img.attr('src', playSrc + rand );
    });
  });

  $.playground.defaultOptions.wrapper = '.playground'

  function launchPlayground(){
    $('.playground-range').playground();
    $('body').on('playgroundUpdated', '.playground-range', function(){
      var $rangeInput = $(this),
          base = $rangeInput.data('playground'),
          $playground = $rangeInput.closest('.playground'),
          $codeEl, targetHtmlStr;

      if ( !$playground.length ) $playground = $rangeInput.closest('article');
      $codeEl = $playground.find('.exampleWithCode code');
          
      if ( $playground.find('.copyable').length ) {
        targetHtmlStr = $playground.find('.copyable')[0].outerHTML;
      } else if ( $playground.find('.copyable-inner').length ) {
        targetHtmlStr = $playground.find('.copyable-inner').html();
      } else {
        targetHtmlStr = base.$targetEl[0].outerHTML;
      }
      
      $codeEl.html(escapeHtml(targetHtmlStr));
      Prism.highlightElement($codeEl[0]);

    });
    $('.playground-range').trigger('input');
  }

  rb.launchPlayground = launchPlayground;
})();
