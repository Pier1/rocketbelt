'use strict';
((rb, window, $) => {
  rb.cardGrids = rb.cardGrids || {};

  const CSS = window.CSS;

  if (CSS &&
      (CSS.supports('display', 'grid') ||
       CSS.supports('display', '-ms-grid'))) {
    const document = window.document;

    const resizeGridItem = (item) => {
      const grid = $(item).closest('.card-grid')[0];
      const rowHeight =
        parseInt($(grid).css('grid-auto-rows'), 10);
      const rowGap = parseInt($(grid).css('grid-row-gap'), 10);
      const itemPadding =
        parseInt($(item).css('paddingTop'), 10) +
        parseInt($(item).css('paddingBottom'), 10);

      const itemContentHeight = item.firstElementChild.getBoundingClientRect().height;
      const itemContentMargin =
        parseInt($(item.firstElementChild).css('marginTop'), 10) +
        parseInt($(item.firstElementChild).css('marginBottom'), 10);

      const rowSpan =
        Math.ceil(
          (itemContentHeight + itemContentMargin + itemPadding + rowGap) / (rowHeight + rowGap)
        );
      item.style.gridRowEnd = `span ${rowSpan}`;
    };

    const resizeAllGridItems = (gridSelector) => {
      const grids = document.querySelectorAll(gridSelector);

      grids.forEach((grid) => {
        const items = grid.querySelectorAll('.card-grid_item');

        items.forEach((item) => {
          rb.cardGrids.resizeGridItem(item);
        });
      });
    };

    const warnAboutGridSupport = () => { console.warn('Browser doesn\'t support CSS grid.'); };

    rb.cardGrids.resizeGridItem = resizeGridItem || warnAboutGridSupport;
    rb.cardGrids.resizeAllGridItems = resizeAllGridItems || warnAboutGridSupport;

    rb.onDocumentReady(() => rb.cardGrids.resizeAllGridItems('.card-grid'));

    // Set rAF-throttled resize listener to call resizeAllGridItems.
    window.addEventListener('rb.optimizedResize', () => {
      rb.cardGrids.resizeAllGridItems('.card-grid');
    });
  }
})(window.rb, window, jQuery);
