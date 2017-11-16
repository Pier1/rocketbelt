(function rocketbeltA11yProgressStepped(window, document) {
  var ARIA_CURRENT = 'aria-current';

  function onAttrMutation(mutations) {
    var mutationsLen = mutations.length;

    for (var i = 0; i < mutationsLen; i++) {
      var mutation = mutations[i];
      var attributes = mutation.target.attributes;

      var hasAriaCurrent = attributes.getNamedItem(ARIA_CURRENT) ? true : false;
      // If target's attributes include aria-current
      if (hasAriaCurrent) {
        // Decorate current & subsequent links with aria-disabled
        var linksToDisable = mutation.target.parentNode.querySelectorAll('[' + ARIA_CURRENT + '] a, [' + ARIA_CURRENT + '] ~ li a');
        var linksLen = linksToDisable.length;

        for (var j = 0; j < linksLen; j++) {
          var link = linksToDisable[j];
          link.setAttribute('aria-disabled', true);
        }
      } else {
      // If target doesn't have aria-current, remove aria-disabled from child link
        var linkToEnable = mutation.target.querySelector('a');
        linkToEnable.removeAttribute('aria-disabled');
      }
    }
  }

  function decorateProgressStepped() {
    var progressIndicators = document.querySelectorAll('.progress-stepped');
    var progressIndicatorsLen = progressIndicators.length;

    for (var i = 0; i < progressIndicatorsLen; i++) {
      var progressIndicator = progressIndicators[i];

      if (!progressIndicator.hasAttribute('aria-label')) {
        progressIndicator.setAttribute('aria-label', 'Progress Indicator');
      }

      progressIndicator.setAttribute('role', 'nav');

      var observer = new MutationObserver(function onmutate(mutations) { onAttrMutation(mutations); });
      observer.observe(progressIndicator, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['aria-current'] });

      var current = progressIndicator.querySelector('[' + ARIA_CURRENT + ']');
      if (!current) {
        progressIndicator.querySelector('li').setAttribute(ARIA_CURRENT, 'page');
      }
    }
  }

  window.rb.onDocumentReady(decorateProgressStepped);
})(window, document);
