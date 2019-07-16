'use strict';

((rb, document, $) => {
  const keys = {
    ARROWS: [37, 38, 39, 40],
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    ENTER: 13,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34
  };

  const init = function init(selector) {
    let $tabcordion = $(this);

    // Check Number.isInteger because the init function is called
    // from $.each, which passes the array index.
    if (selector && !(Number.isInteger(selector))) {
      $tabcordion = $(selector);
    }

    const $navlist = $tabcordion.find('.tabcordion_navlist');

    $navlist.on('keydown', '.tabcordion_nav-item .tabcordion_nav-trigger',
      function onKeydown(keyVent) {
        const which = keyVent.which;
        const target = keyVent.target;

        if ($.inArray(which, keys.ARROWS) > -1) {
          const adjacentTab = findAdjacentTab(target, $navlist, which);

          if (adjacentTab) {
            keyVent.preventDefault();
            adjacentTab.focus();

            const eventData = { 'previousTarget': target, 'newTarget': adjacentTab };
            const event = new CustomEvent('rb.tabcordion.tabChanged', { detail: eventData });
            $tabcordion[0].dispatchEvent(event);

            setActiveAndInactive(adjacentTab, $navlist);
          }
        } else if (which === keys.ENTER || which === keys.SPACE) {
          keyVent.preventDefault();
          target.click();
        } else if (which === keys.PAGE_DOWN) {
          keyVent.preventDefault();
          const assocPanel = $(`#${this.getAttribute('aria-controls')}`);

          if (assocPanel) {
            assocPanel.focus();
          }
        }
      }
    );

    // Click support
    $navlist.on('click', '.tabcordion_nav-item .tabcordion_nav-trigger',
      function onClick() {
        const currentTarget =
          $navlist.find('.tabcordion_nav-item.is-active .tabcordion_nav-trigger')[0];
        if (currentTarget != $(this)[0]) {
          const eventData = { 'previousTarget': currentTarget, 'newTarget': $(this)[0] };
          const event = new CustomEvent('rb.tabcordion.tabChanged', { detail: eventData });
          $tabcordion[0].dispatchEvent(event);
        }

        setActiveAndInactive(this, $navlist);
      }
    );

    addAriaAttributes($tabcordion);

    // Initial configuration based on viewport width
    determineView();
  };

  const addAriaAttributes = ($tabcordion) => {
    const $tabTriggers = $tabcordion.find('.tabcordion_nav-trigger');

    $tabTriggers.each((i, el) => {
      $(el).attr(rb.aria.setsize, $tabTriggers.length);
      $(el).attr(rb.aria.posinset, i + 1);
    });
  };

  $(document.body).on('keydown', '.tabcordion_panel', function onKeydown(e) {
    if (e.which === keys.PAGE_UP) {
      e.preventDefault();
      const $navlist = $(this).closest('.tabcordion').find('.tabcordion_navlist');
      const activeTab = $navlist.find('.tabcordion_nav-item.is-active .tabcordion_nav-trigger')[0];

      if (activeTab) {
        activeTab.focus();
      }
    }
  });

  function findAdjacentTab(startTab, $list, key) {
    const dir = (key === keys.ARROW_LEFT || key === keys.ARROW_UP) ? 'prev' : 'next';
    let adjacentTab = (dir === 'prev') ?
                      $(startTab.parentNode).prev()[0] :
                      $(startTab.parentNode).next()[0];

    if (!adjacentTab) {
      const allTabs = $list.find('.tabcordion_nav-item');
      if (dir === 'prev') {
        adjacentTab = allTabs[allTabs.length - 1];
      } else {
        adjacentTab = allTabs[0];
      }
    }

    return $(adjacentTab).find('.tabcordion_nav-trigger')[0];
  }

  function setActiveAndInactive(newActive, $list) {
    $list.find('.tabcordion_nav-item').each(function decorateNavItems() {
      const assocPanelID = $(this)
                            .find('.tabcordion_nav-trigger')
                            .first()
                            .attr('aria-controls');
      const anchor = $(this).find('.tabcordion_nav-trigger')[0];

      if (this !== newActive.parentNode ||
          ($(this).hasClass('is-active') &&
           $(this).closest('.tabcordion').hasClass('is-accordion'))) {
        $(this).removeClass('is-active');
        anchor.tabIndex = -1;
        anchor.setAttribute('aria-selected', 'false');
        $('#' + assocPanelID)
          .removeClass('is-current')
          .attr('aria-hidden', 'true');
      } else {
        $(this).addClass('is-active');
        anchor.tabIndex = 0;
        anchor.setAttribute('aria-selected', 'true');
        $(`#${assocPanelID}`)
          .addClass('is-current')
          .removeAttr('aria-hidden');
      }
    });
  }

  function determineView() {
    const $tabContainer = $('.tabcordion');
    const breakpointOverride = $tabContainer.data('breakpoint');
    const breakpoint = breakpointOverride ? breakpointOverride : 480;

    $tabContainer.each(function setView() {
      const $tabcordion = $(this);
      const containerWidth = $tabcordion.width();
      const $panels = $tabcordion.find('.tabcordion_panels');
      const $navlist = $tabcordion.find('.tabcordion_navlist');

      const isStatic = $tabcordion.hasClass('is-static');
      const isAccordionView = $tabcordion.hasClass('is-accordion');
      const isTabsView = !isAccordionView;

      if (!isStatic) {
        if (containerWidth <= breakpoint && !isAccordionView) {
          // Switch to accordion
          $tabcordion
            .removeClass('is-tabs')
            .addClass('is-accordion');

          // Better markup semantics for accordion
          $panels.find('.tabcordion_panel').each(function setPanelID() {
            const panelID = this.id;
            const assocLink = panelID &&
              $(`.tabcordion_navlist .tabcordion_nav-trigger[aria-controls="${panelID}"]`)[0];
            if (assocLink) {
              $(assocLink.parentNode).append(this);
            }
          });
        } else if (containerWidth > breakpoint && !isTabsView) {
          // Switch to tabs
          const wasAccordion = $tabcordion.hasClass('is-accordion');
          $tabcordion
            .removeClass('is-accordion')
            .addClass('is-tabs');

          if (wasAccordion) {
            $navlist.find('.tabcordion_panel').each(function appendPanel() {
              $panels.append(this);
            });
          }
        }
      }
    });
  }

  const $tabcordions = $('.tabcordion');
  $tabcordions.each(init);
  window.addEventListener('rb.optimizedResize', determineView);

  rb.tabcordions = rb.tabcordions || {};
  rb.tabcordions.init = init;
  rb.tabcordions.addAriaAttributes = addAriaAttributes;
})(window.rb, document, jQuery);
