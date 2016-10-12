(function () {
  'use strict';

  $(document).ready(function () {
    var $firstTab = $('.tabs .tab').first();
    $firstTab.before('<div class="highlight"></div>');

    var $highlight = $('.tabs .highlight');
    var $label = $firstTab.children('.tab_label');

    var hlHeight = 3;
    var borderWidth = 1;
    var height = $label.position().top + $label.outerHeight(true) - hlHeight;
    var left   = $label.position().left;
    var width  = $label.outerWidth(true) - borderWidth;
    $highlight.css('top', height + 'px');
    $highlight.css('left', left + 'px');
    $highlight.css('width', width + 'px');

    $('.tabs .tab_label').on('click', function () {
      var $el = $(this);
      var $hl = $el.closest('.tab').siblings('.highlight');

      var borderWidth = 1;
      var left   = $el.position().left;
      var width  = $el.outerWidth(true) - borderWidth;
      $hl.css('left', left + 'px');
      $hl.css('width', width + 'px');
    });
  });
})();
