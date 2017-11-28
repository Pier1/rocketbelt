(function rocketbeltBusyIndicators(rb, document) {
  function onClassMutation(mutations) {
    var mutationsLen = mutations && mutations.length ? mutations.length : 0;

    for (var k = 0; k < mutationsLen; k++) {
      var mutation = mutations[k];
      var el = mutation.target;

      if (mutation.target.classList.contains('is-busy')) {
        // If "is-busy" was added, do the decoratin'
        var dot = '<div class="dot" aria-hidden="true"></div>';
        var a11yAttrs = 'aria-label="Loading." role="alert" aria-live="polite" aria-busy="true"';
        var elType = el.nodeName === 'UL' || el.nodeName === 'OL' ? 'li' : 'div';
        var fragment = '<' + elType + ' class="is-busy_overlay is-busy_overlay-opaque" ' + a11yAttrs + '>' + dot + dot + dot + '</' + elType + '>';

        el.innerHTML = el.innerHTML + fragment;
      } else {
        // If "is-busy" was removed
        var overlay = el.querySelectorAll('.is-busy_overlay')[0];

        if (overlay) {
          overlay.parentNode.removeChild(overlay);
        }
      }
    }
  }

  function observeComponents() {
    var busyable = document.querySelectorAll('.is-busyable');

    if (busyable.length === 0) {
      busyable = document.querySelectorAll('body');
    }

    var busyableLen = busyable.length;

    for (var i = 0; i < busyableLen; i++) {
      var busyableEl = busyable[i];

      // Set an observer to listen for .invalid.
      var observer = new MutationObserver(function (mutations) { onClassMutation(mutations); });
      observer.observe(busyableEl, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
    }
  }

  rb.onDocumentReady(observeComponents);
  rb.progressIndicators = rb.progressIndicators || {};
  rb.progressIndicators.observeComponents = observeComponents;
})(window.rb, document);
