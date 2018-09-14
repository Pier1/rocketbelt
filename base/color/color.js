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
        const toHex = function toHex(rgbString) {
          let els = rgbString.split('(')[1].split(')')[0].split(',');
          let hex = els.map(function (x) {
            x = parseInt(x).toString(16);
            return (x.length === 1) ? '0' + x : x;
          });

          return hex.join('');
        };

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
        var rgb = $swatch.css('background-color');

        $variantInfo.find('.color-name').text(name);
        $variantInfo.find('.copy-button-sass').attr('data-clipboard-text', colorMap);
        $variantInfo.find('.copy-button-hex').attr('data-clipboard-text', '#' + toHex(rgb));
        $variantInfo.find('.variant-title').text(variant);
        $variantInfo.find('.color-map').text(colorMap);
      }
    );
  });
})();
