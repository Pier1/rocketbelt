(function rocketbeltA11yProgressStepped(rb, document) {
  var aria = rb.aria;

  function onAttrMutation(mutations) {
    var mutationsLen = mutations.length;

    for (var i = 0; i < mutationsLen; i++) {
      var mutation = mutations[i];
      var attributes = mutation.target.attributes;

      var hasAriaCurrent = attributes.getNamedItem(aria.current) ? true : false;
      // If target's attributes include aria-current
      if (hasAriaCurrent) {
        // Decorate current & subsequent links with aria-disabled
        var linksToDisable = mutation.target.parentNode.querySelectorAll('[' + aria.current + '] a, [' + aria.current + '] ~ li a');
        var linksLen = linksToDisable.length;

        for (var j = 0; j < linksLen; j++) {
          var link = linksToDisable[j];
          link.setAttribute(aria.disabled, true);
        }
      } else {
      // If target doesn't have aria-current, remove aria-disabled from child link
        var linkToEnable = mutation.target.querySelector('a');
        linkToEnable.removeAttribute(aria.disabled);
      }
    }
  }

  function decorateProgressStepped() {
    var progressIndicators = document.querySelectorAll('.progress-stepped');
    var progressIndicatorsLen = progressIndicators.length;

    for (var i = 0; i < progressIndicatorsLen; i++) {
      var progressIndicator = progressIndicators[i];

      if (!progressIndicator.hasAttribute(aria.label)) {
        progressIndicator.setAttribute(aria.label, 'Progress Indicator');
      }

      progressIndicator.setAttribute('role', 'nav');

      var observer = new MutationObserver(function onmutate(mutations) { onAttrMutation(mutations); });
      observer.observe(progressIndicator, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: [aria.current] });

      var current = progressIndicator.querySelector('[' + aria.current + ']');
      if (!current) {
        current = progressIndicator.querySelector('li');
        current.setAttribute(aria.current, 'page');
      }

      current.querySelector('a').setAttribute(aria.disabled, 'true');

      var sibs = progressIndicator.querySelectorAll('[' + aria.current + '] ~ li a');
      var sibsLen = sibs.length;

      for (var j = 0; j < sibsLen; j++) {
        var sib = sibs[j];
        sib.setAttribute(aria.disabled, 'true');
      }
    }
  }

  window.rb.onDocumentReady(decorateProgressStepped);
})(window.rb, document);
