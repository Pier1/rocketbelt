'use strict';
((rb, document) => {
  function onClassMutation(mutations) {
    const mutationsLen = mutations && mutations.length ? mutations.length : 0;

    for (let k = 0; k < mutationsLen; k++) {
      const mutation = mutations[k];
      const el = mutation.target;
      const oldValue = mutation.oldValue;

      setIndicators(el, oldValue);
    }
  }

  function setIndicators(el, oldValue) {
    if ((!oldValue || !oldValue.match(/\bis-busy\b/)) &&
        el.classList &&
        el.classList.contains('is-busy')) {
      // If "is-busy" was added, do the decoratin'
      if (el.getElementsByClassName('is-busy_overlay').length === 0) {
        // Only add overlay if one doesn't already exist
        let markup = '';

        if (el.classList.contains('is-busyable-page')) {
          const segmentClass = 'flip-loader_segment';
          const segment = `<div class="${segmentClass}"></div>`;

          const message = el.dataset.rbIsBusyMessage;
          const messageAttr = message ? ` data-rb-is-busy-message="${message}"` : '';

          markup = `<div class="flip-loader"${messageAttr}>\
                      <div class="flip-loader_segments">\
                        ${segment.repeat(5)}\
                      </div>\
                    </div>`;

          let delay = el.dataset.rbIsBusyMessageAfterSeconds;

          if (message) {
            if (!delay) {
              delay = 0;
            }

            setTimeout(() => {
              const loader = el.querySelector('.flip-loader');
              if (loader && loader.classList) {
                loader.classList.add('is-busy_message-shown');
              }
            }, delay * 1000);
          }
        } else {
          markup = '<div class="dot" aria-hidden="true"></div>'.repeat(5);
        }

        const a11yAttrs =
          'aria-label="Loading." role="alert" aria-live="assertive" aria-busy="true"';
        const elType = el.nodeName === 'UL' || el.nodeName === 'OL' ? 'li' : 'div';
        const fragment =
          `<${elType} class="is-busy_overlay" ${a11yAttrs}>\
            ${markup}\
          </${elType}>`;

        el.insertAdjacentHTML('beforeend', fragment);

        requestAnimationFrame(() => {
          const overlay = el.querySelector('.is-busy_overlay');
          if (overlay  && overlay.classList) {
            overlay.classList.add('is-busy_overlay-opaque');
          }
        });
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
      observer.observe(
        busyableEl,
        { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class'] }
      );
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
