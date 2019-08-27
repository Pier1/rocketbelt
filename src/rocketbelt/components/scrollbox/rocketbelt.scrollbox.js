'use strict';
((window, document, $) => {
  const $scrollboxes = $('.scrollbox');

  $scrollboxes.each(function (index) {
    const $scrollbox = $(this);
    const sb = $scrollbox[0];
    const threshold = 16;

    const indicatorWidth = sb.style.getPropertyValue('--indicator-width');
    const width = sb.offsetLeft + sb.clientWidth - indicatorWidth + 'px';
    sb.style.setProperty('--indicate-right-left-prop', width);

    if (sb.scrollWidth > sb.clientWidth) {
      $scrollbox.addClass('indicate-right');
    }

    $scrollbox.css('height', $scrollbox.height());
    $scrollbox.on('scroll', (e) => {
      const target = e.target;

      let diff;
      let prop = '';
      if (target.scrollLeft <= 100) {
        diff = target.scrollLeft;
        prop = '--indicate-left-opacity';
      } else {
        diff = target.scrollWidth - (target.clientWidth + target.scrollLeft + threshold);
        prop = '--indicate-right-opacity';
      }

      if (Math.abs(diff) < 100) {
        const opacity = (diff / 100).toFixed(2);
        target.style.setProperty(prop, opacity);
      } else {
        target.style.setProperty(prop, 1);
      }

      if (target.clientWidth + target.scrollLeft + threshold >= target.scrollWidth) {
        $(e.target).removeClass('indicate-right');
      } else if (target.scrollLeft <= threshold) {
        $(e.target).removeClass('indicate-left');
      } else {
        $(e.target).addClass('indicate-left').addClass('indicate-right');
      }
    });
  });
})(window, document, jQuery)