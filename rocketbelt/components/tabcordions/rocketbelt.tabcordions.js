(function ($) {
  var $tabcordions = $('.tabcordion');

  var keys = {
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

  $tabcordions.each(function () {
    var $tabcordion = $(this);
    var $navlist = $tabcordion.find('.tabcordion_navlist');

    $navlist.on('keydown', '.tabcordion_nav-item .tabcordion_nav-trigger', function (keyVent) {
      var which = keyVent.which;
      var target = keyVent.target;

      if ($.inArray(which, keys.ARROWS) > -1) {
        var adjacentTab = findAdjacentTab(target, $navlist, which);

        if (adjacentTab) {
          keyVent.preventDefault();
          adjacentTab.focus();

          setActiveAndInactive(adjacentTab, $navlist);
        }
      }
      else if (which === keys.ENTER || which === keys.SPACE) {
        keyVent.preventDefault();
        target.click();
      }
      else if (which === keys.PAGE_DOWN) {
        keyVent.preventDefault();
        var assocPanel = $('#' + this.getAttribute('aria-controls'));

        if (assocPanel) {
          assocPanel.focus();
        }
      }
    });

    // Click support
    $navlist.on('click', '.tabcordion_nav-item .tabcordion_nav-trigger', function () {

      var currentTarget = $navlist.find('.tabcordion_nav-item.is-active .tabcordion_nav-trigger')[0];
      if (currentTarget != $(this)[0]) {
        var eventData = {'previousTarget': currentTarget, 'newTarget': $(this)[0]};
        var event = new CustomEvent('rb.tabcordion.tabChanged', {detail: eventData});
        $(this)[0].dispatchEvent(event);
      }
      
      setActiveAndInactive(this, $navlist);
      
    });
  });

  $(document.body).on('keydown', '.tabcordion_panel', function (e) {
    if (e.which === keys.PAGE_UP) {
      e.preventDefault();
      var $navlist = $(this).closest('.tabcordion').find('.tabcordion_navlist');
      var activeTab = $navlist.find('.tabcordion_nav-item.is-active .tabcordion_nav-trigger')[0];

      if (activeTab) {
        activeTab.focus();
      }
    }
  });

  function findAdjacentTab(startTab, $list, key) {
    var dir = (key === keys.ARROW_LEFT || key === keys.ARROW_UP) ? 'prev' : 'next';
    var adjacentTab = (dir === 'prev') ?
                      $(startTab.parentNode).prev()[0] :
                      $(startTab.parentNode).next()[0];

    if (!adjacentTab) {
      var allTabs = $list.find('.tabcordion_nav-item');
      if (dir === 'prev') {
        adjacentTab = allTabs[allTabs.length - 1];
      }
      else {
        adjacentTab = allTabs[0];
      }
    }

    return $(adjacentTab).find('.tabcordion_nav-trigger')[0];
  }

  function setActiveAndInactive(newActive, $list) {
    $list.find('.tabcordion_nav-item').each(function () {
      var assocPanelID = $(this)
                            .find('.tabcordion_nav-trigger')
                            .first()
                            .attr('aria-controls');
      var anchor = $(this).find('.tabcordion_nav-trigger')[0];

      if (this !== newActive.parentNode) {
        $(this).removeClass('is-active');
        anchor.tabIndex = -1;
        anchor.setAttribute('aria-selected', 'false');
        $('#' + assocPanelID)
          .removeClass('is-current')
          .attr('aria-hidden', 'true');
      }
      else {
        $(this).addClass('is-active');
        anchor.tabIndex = 0;
        anchor.setAttribute('aria-selected', 'true');
        $('#' + assocPanelID)
          .addClass('is-current')
          .removeAttr('aria-hidden');
      }
    });
  }

  // Initial configuration based on viewport width
  determineView();

  // Debounced Resize() jQuery Plugin
  // Author: Paul Irish
  (function ($, sr) {
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced() {
        var obj = this;
        var args = arguments;
        function delayed() {
          if (!execAsap) {
            func.apply(obj, args);
          }
          timeout = null;
        }

        if (timeout) {
          clearTimeout(timeout);
        }
        else if (execAsap) {
          func.apply(obj, args);
        }

        timeout = setTimeout(delayed, threshold || 100);
      };
    };
    // smartresize
    jQuery.fn[sr] = function (fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
  })(jQuery, 'smartresize');

  // Resize event:
  $(window).smartresize(determineView);

  function determineView() {
    
    var $tabContainer = $('.tabcordion');
    var breakpoint = 480;

    $tabContainer.each(function () {
      var $tabcordion = $(this);
      var containerWidth = $tabcordion.width();
      var $panels = $tabcordion.find('.tabcordion_panels');
      var $navlist = $tabcordion.find('.tabcordion_navlist');

      var isStatic = $tabcordion.hasClass('is-static');
      var isAccordionView = $tabcordion.hasClass('is-accordion');
      var isTabsView = !isAccordionView;

      if (!isStatic) {
        if (containerWidth <= breakpoint && !isAccordionView) {
          // Switch to accordion
          $tabcordion
            .removeClass('is-tabs')
            .addClass('is-accordion');

          // Better markup semantics for accordion
          $panels.find('.tabcordion_panel').each(function () {
            var panelID = this.id;
            var assocLink = panelID && $('.tabcordion_navlist .tabcordion_nav-trigger[aria-controls="' + panelID + '"]')[0];
            if (assocLink) {
              $(assocLink.parentNode).append(this);
            }
          });
        }
        else if (containerWidth > breakpoint && !isTabsView) {
          // Switch to tabs
          var wasAccordion = $tabcordion.hasClass('is-accordion');
          $tabcordion
            .removeClass('is-accordion')
            .addClass('is-tabs');

          if (wasAccordion) {
            $navlist.find('.tabcordion_panel').each(function () {
              $panels.append(this);
            });
          }
        }
      }
    });
  }
})(jQuery);
