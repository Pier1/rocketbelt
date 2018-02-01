'use strict';
((rb, document) => {
  const aria = rb.aria;
  const DESCRIBED_BY_ERROR_ID_ATTR = 'data-rb-describedbyerrorid';

  function onClassMutation(mutations) {
    const mutationsLen = mutations.length;

    for (let k = 0; k < mutationsLen; k++) {
      const mutation = mutations[k];
      const el = mutation.target;
      const message = el.parentNode.querySelector('.validation-message');

      let describedByErrorId = '';
      let describedByIds = [];
      let i = -1;

      if (mutation.oldValue !== 'invalid' && mutation.target.classList.contains('invalid')) {
        // If "invalid" was added, do the decoratin'
        el.setAttribute(aria.invalid, 'true');
        describedByErrorId = el.getAttribute(DESCRIBED_BY_ERROR_ID_ATTR);
        describedByIds = el.getAttribute(aria.describedby).split(' ');
        i = describedByIds.indexOf(describedByErrorId);

        if (message) {
          message.setAttribute(aria.role, 'alert');
          message.setAttribute(aria.live, 'polite');

          // If a validation message exists && the related element is newly invalid,
          // add message id to described-by
          if (i === -1) {
            describedByIds.push(describedByErrorId);
            el.setAttribute(aria.describedby, describedByIds.join(' '));
          }
        }
      } else if (mutation.oldValue === 'invalid' && !el.classList.contains('invalid')) {
        // If "invalid" was removed
        el.setAttribute(aria.invalid, 'false');
        describedByErrorId = el.getAttribute(DESCRIBED_BY_ERROR_ID_ATTR);
        describedByIds = el.getAttribute(aria.describedby).split(' ');
        i = describedByIds.indexOf(describedByErrorId);

        if (message) {
          message.removeAttribute('role');
          message.removeAttribute(aria.live);

          // If a validation message exists && the related element longer invalid,
          // remove message id from described-by
          if (i > -1) {
            describedByIds.splice(i, 1);
            el.setAttribute(aria.describedby, describedByIds.join(' '));
          }
        }
      }
    }
  }

  function decorateInputs() {
    const formEls = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea, .form-group fieldset');
    const formElsLen = formEls.length;

    for (let i = 0; i < formElsLen; i++) {
      const formEl = formEls[i];

      // Set an observer to listen for .invalid.
      const observer = new MutationObserver(mutations => { onClassMutation(mutations); });
      observer.observe(formEl, { subtree: false, attributes: true, attributeOldValue: true, attributeFilter: ['class'] });

      const messages = formEl.parentNode.querySelectorAll('.validation-message, .helper-text');
      const msgLen = messages.length;

      if (msgLen > 0) {
        let describedByIds = '';

        if (formEl.hasAttribute(aria.describedby)) {
          describedByIds = `${formEl.getAttribute(aria.describedby)} `;
        }

        for (let j = 0; j < msgLen; j++) {
          const thisMsg = messages[j];
          const id = thisMsg.id ? thisMsg.id : `rb-a11y_${rb.getShortId()}`;
          describedByIds += `${id} `;

          if (thisMsg.classList.contains('validation-message')) {
            formEl.setAttribute(DESCRIBED_BY_ERROR_ID_ATTR, id);
          }

          // Don't clobber any existing attributes!
          if (!thisMsg.id) {
            thisMsg.id = id;
          }
        }

        if (!formEl.hasAttribute(aria.describedby)) {
          formEl.setAttribute(aria.describedby, describedByIds.trim());
        }
      }
    }
  }

  rb.onDocumentReady(decorateInputs);
  rb.forms = rb.forms || {};
  rb.forms.decorateInputs = decorateInputs;
})(window.rb, document);
