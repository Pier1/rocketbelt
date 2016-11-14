var rb = rb || {};

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
    var clipboard = new Clipboard('.copy-code');

    clipboard.on('success', function(e) {
        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });

    // sets the active page in the nav
  	var $category,
        pageTitle = document.title.toLowerCase()
              .replace(' | rocketbelt pattern library', '')
              .replace(/\ & /g," and ")
              .replace(/\s+/g,'-');
    $('.is-active', '#docs-leftnav').removeClass('is-active');
  	$category = $('#docs-leftnav').find('li[ref="' + pageTitle + '"]');
    $category.addClass('is-active');
    $category.parent('.category-contents').siblings('.category-toggle').prop('checked', true);

    // Play button for gifs
    $('img.gipho').on('click', function(){
      var $img = $(this),
        playSrc = $img.attr('data-play'),
          rand = ( playSrc.indexOf('?') > -1 ? '&' : '?' ) + (Math.random() * 1000|0);
      $img.attr('src', playSrc + rand );
    });

    // Mobile heuristic. 48rem == 'md' breakpoint.
    if (window.matchMedia('(min-width: 48rem)')) {
      $('.is-active').parent().siblings('.category-toggle').prop('checked', true);
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

  // Playground defaults specific to Rocketbelt.
  $.playground.defaultOptions.wrapper = '.playground'

  // Sets up all playground elements and makes the code copy function for dynamic elements
  function launchPlayground(){
    $('.playground-item').playground();
    $('body').on('playgroundUpdated', '.playground-item', function(){
      var $input = $(this),
          base = $input.data('playground'),
          $playground = $input.closest('.playground'),
          $codeEl, targetHtmlStr;

      if ( !$playground.length ) $playground = $input.closest('article');
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
    // Sets the code section on page load.
    $('.playground-item').trigger('input');
  }

  // Exposes playground setup to a global so that it only gets setup when necessary.
  rb.launchPlayground = launchPlayground;

  $('button.with-load').buttonLoad();

})();
