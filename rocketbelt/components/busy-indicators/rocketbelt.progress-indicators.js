'use strict';
((rb, document) => {
  function onClassMutation(mutations) {
    const mutationsLen = mutations && mutations.length ? mutations.length : 0;

    for (let k = 0; k < mutationsLen; k++) {
      const mutation = mutations[k];
      const el = mutation.target;

      setIndicators(el);
    }
  }

  function setIndicators(el) {
    if (el.classList && el.classList.contains('is-busy')) {
      // If "is-busy" was added, do the decoratin'
      if (el.getElementsByClassName('is-busy_overlay').length === 0) {
        // Only add overlay if one doesn't already exist
        let markup = '';

        if (el.classList.contains('is-busyable-page')) {
          markup = '<div class="box-loader"><div class="border"></div><div class="border"></div><div class="border"></div><div class="border"></div></div>';
        } else {
          markup = '<div class="dot" aria-hidden="true"></div><div class="dot" aria-hidden="true"></div><div class="dot" aria-hidden="true"></div>';
        }

        const a11yAttrs =
          'aria-label="Loading." role="alert" aria-live="polite" aria-busy="true"';
        const elType = el.nodeName === 'UL' || el.nodeName === 'OL' ? 'li' : 'div';
        const fragment =
          `<${elType} class="is-busy_overlay is-busy_overlay-opaque" ${a11yAttrs}>\
            ${markup}\
          </${elType}>`;

        el.insertAdjacentHTML('beforeend', fragment);
      }
    } else {
      // If "is-busy" was removed
      const overlay = el.querySelectorAll('.is-busy_overlay')[0];

      if (overlay && !overlay.parentNode.classList.contains('is-busy')) {
        overlay.parentNode.removeChild(overlay);
      }
    }
  }

  function observeComponents() {
    let busyable = document.querySelectorAll('.is-busyable');

    if (busyable.length === 0) {
      busyable = document.querySelectorAll('body');
    }

    const busyableLen = busyable.length;

    for (let i = 0; i < busyableLen; i++) {
      const busyableEl = busyable[i];

      // Set an observer to listen for .invalid.
      const observer = new MutationObserver((mutations) => { onClassMutation(mutations); });
      observer.observe(busyableEl, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
    }
  }

  rb.onDocumentReady(() => {
    // Set busy indicators for any elements that have `.is-busy` on page load.
    const els = document.querySelectorAll('.is-busy');
    els.forEach((el) => {
      setIndicators(el);
    });
  });
  rb.onDocumentReady(observeComponents);
  rb.progressIndicators = rb.progressIndicators || {};
  rb.progressIndicators.setIndicators = setIndicators;
  rb.progressIndicators.observeComponents = observeComponents;
})(window.rb, document);
