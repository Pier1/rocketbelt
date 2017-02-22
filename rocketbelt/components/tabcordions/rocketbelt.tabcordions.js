var $navlist = $('#navlist');
var $tabContainer = $('#tab-container');
var $panels = $('#panels');

$navlist.on('keydown', 'li button', function (keyVent) {
  var arrows = [37, 38, 39, 40];
  var which = keyVent.which;
  var target = keyVent.target;
  if ($.inArray(which, arrows) > -1) {
    var adjacentTab = findAdjacentTab(target, $navlist, which);

    if (adjacentTab) {
      keyVent.preventDefault();
      adjacentTab.focus();
      // if desired behavior is that when tab recieves focus -> make it the active tab:
      setActiveAndInactive(adjacentTab, $navlist);
    }
  } else if (which === 13 || which === 32) { // ENTER |or| SPACE
    keyVent.preventDefault(); // don't scroll the page around...
    target.click();
  } else if (which === 34) { // PAGE DOWN
    keyVent.preventDefault(); // don't scroll the page
    var assocPanel = $('#' + this.getAttribute('aria-controls'));
    if (assocPanel) {
      assocPanel.focus();
    }
  }
});

$(document.body).on('keydown', '.panel', function (e) {
  if (e.which === 33) { // PAGE UP
    e.preventDefault(); // don't scroll
    var activeTab = $navlist.find('li.active button')[0];
    if (activeTab) {
      activeTab.focus();
    }
  }
});

// click support
$navlist.on('click', 'li button', function () {
  setActiveAndInactive(this, $navlist);
});

function findAdjacentTab(startTab, $list, key) {
  var dir = (key === 37 || key === 38) ? 'prev' : 'next';
  var adjacentTab = (dir === 'prev') ?
                    $(startTab.parentNode).prev()[0] :
                    $(startTab.parentNode).next()[0];

  if (!adjacentTab) {
    var allTabs = $list.find('li');
    if (dir === 'prev') {
      adjacentTab = allTabs[allTabs.length - 1];
    } else {
      adjacentTab = allTabs[0];
    }
  }

  return $(adjacentTab).find('button')[0];
}

function setActiveAndInactive(newActive, $list) {
  $list.find('li').each(function () {
    var assocPanelID = $(this)
                          .find('button')
                          .first()
                          .attr('aria-controls');
    var anchor = $(this).find('button')[0];

    if (this !== newActive.parentNode) {
      $(this).removeClass('active');
      anchor.tabIndex = -1;
      anchor.setAttribute('aria-selected', 'false');
      $('#' + assocPanelID)
        .removeClass('current')
        .attr('aria-hidden', 'true');
    } else {
      $(this).addClass('active');
      anchor.tabIndex = 0;
      anchor.setAttribute('aria-selected', 'true');
      $('#' + assocPanelID)
        .addClass('current')
        .removeAttr('aria-hidden');
    }

  });
}

// initial configuration based on window's width
var isAccordionView = false;
var isTabsView = false;

determineView();

// Debounced Resize() jQuery Plugin
// Author: Paul Irish
(function($, sr){
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          }

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  };
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');


// RESIZE EVENT:
$(window).smartresize(determineView);


function determineView() {
  var winWidth = $(window).width();

  if (winWidth <= 800 && !isAccordionView) { // SHOW ACCORDION VIEW
    // switch to the accordion view
    $tabContainer
      .removeClass('tabs-view')
      .addClass('accordion-view');

    // fix the markup to be more suited for accordions
    $panels.find('.panel').each(function () {
      var panelID = this.id;
      var assocLink = panelID && $('#navlist button[aria-controls="' + panelID + '"]')[0];
      if (assocLink) {
        $(assocLink.parentNode).append(this);
      }
    });

    isAccordionView = true;
    isTabsView = false;
  } else if (winWidth > 800 && !isTabsView) { // SHOW TABS VIEW
    var wasAccordion = $tabContainer.hasClass('accordion-view');
    // switch to the tabs view
    $tabContainer
      .removeClass('accordion-view')
      .addClass('tabs-view');

    if (wasAccordion) {
      $navlist.find('.panel').each(function () {
        $panels.append(this);
      });
    }

    isTabsView = true;
    isAccordionView = false;
  }
}
