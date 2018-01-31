'use strict';
((rb, document) => {
  const aria = rb.aria;

  function onAttrMutation(mutations) {
    const mutationsLen = mutations.length;

    for (let i = 0; i < mutationsLen; i++) {
      const mutation = mutations[i];
      const attributes = mutation.target.attributes;

      const hasAriaCurrent = attributes.getNamedItem(aria.current) ? true : false;
      // If target's attributes include aria-current
      if (hasAriaCurrent) {
        // Add visually-hidden descriptor
        const span = document.createElement('span');
        span.textContent = 'Current Step: ';
        span.setAttribute('class', 'visually-hidden');
        mutation.target.insertBefore(span, mutation.target.querySelector('a'));

        // Decorate current & subsequent links with aria-disabled
        const linksToDisable =
          mutation
            .target
            .parentNode
            .querySelectorAll(`[${aria.current}] a, [${aria.current}] ~ li a`);
        const linksLen = linksToDisable.length;

        for (let j = 0; j < linksLen; j++) {
          const link = linksToDisable[j];
          link.setAttribute(aria.disabled, true);
        }
      } else {
      // If target doesn't have aria-current, remove aria-disabled from child link
        const linkToEnable = mutation.target.querySelector('a');
        linkToEnable.removeAttribute(aria.disabled);
        const hiddenText = linkToEnable.parentNode.querySelector('.visually-hidden');

        if (hiddenText) {
          hiddenText.textContent = 'Completed: ';
        }
      }
    }
  }

  function decorateProgressStepped() {
    const progressIndicators = document.querySelectorAll('.progress-stepped');
    const progressIndicatorsLen = progressIndicators.length;

    for (let i = 0; i < progressIndicatorsLen; i++) {
      const progressIndicator = progressIndicators[i];

      if (!progressIndicator.hasAttribute(aria.label)) {
        progressIndicator.setAttribute(aria.label, 'Progress Indicator');
      }

      progressIndicator.setAttribute('role', 'nav');
      progressIndicator.setAttribute('tabindex', '0');

      const observer = new MutationObserver((mutations) => { onAttrMutation(mutations); });
      observer.observe(progressIndicator, {
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: [aria.current]
      });

      let current = progressIndicator.querySelector(`[${aria.current}]`);
      if (!current) {
        current = progressIndicator.querySelector('li');
        current.setAttribute(aria.current, 'page');
      }

      current.querySelector('a').setAttribute(aria.disabled, 'true');

      const sibs = progressIndicator.querySelectorAll(`[${aria.current}] ~ li a`);
      const sibsLen = sibs.length;

      for (let j = 0; j < sibsLen; j++) {
        const sib = sibs[j];
        sib.setAttribute(aria.disabled, 'true');
      }
    }
  }

  rb.onDocumentReady(decorateProgressStepped);
  rb.progressIndicators = rb.progressIndicators || {};
  rb.progressIndicators.decorateProgressStepped = decorateProgressStepped;
})(window.rb, document);
