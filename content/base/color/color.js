(function () {
  'use strict';

  $(document).ready(function () {
    var $colorName = $('.color-name');

    $colorName.each(function () {
      var $this = $(this);

      var name = $this.closest('.family').find('.swatch [data-color-variant="base"]').attr('data-color-name');
      $this.text(name);
    });

    $('.variant').hover(
      function () {
        var $t = $(this);
        var $swatch = $t.closest('.swatch');

        var classes = $swatch.attr('class').split(/\s+/);
        for (var i = 0; i < classes.length; i++) {
          if (classes[i].indexOf('bg_') > -1) {
            $swatch.removeClass(classes[i]);
          }
        }

        $swatch.addClass($t.attr('data-color-bg'));

        var $variantInfo = $(this).closest('.family').find('.variant-info');
        var name = $t.attr('data-color-name');
        var variant = $t.attr('data-color-variant');
        var colorMap = $t.attr('data-color-map');

        $variantInfo.children('.color-name').text(name);
        $variantInfo.find('.variant-title').text(variant);
        $variantInfo.find('.color-map').text(colorMap);
      }
    );
  });
})();
