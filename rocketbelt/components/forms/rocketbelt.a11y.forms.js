(function rocketbeltA11yForms(window, document) {
  function onClassMutation(mutations) {
    var mutationsLen = mutations.length;

    for (var k = 0; k < mutationsLen; k++) {
      var mutation = mutations[k];
      var el = mutation.target;
      var message = el.parentNode.querySelector('.validation-message');

      if (mutation.oldValue !== 'invalid' && mutation.target.classList.contains('invalid')) {
        // If "invalid" was added, do the decoratin'
        el.setAttribute('aria-invalid', 'true');
        message.setAttribute('role', 'alert');
        message.setAttribute('aria-live', 'polite');
      } else if (mutation.oldValue === 'invalid' && !el.classList.contains('invalid')) {
        // If "invalid" was removed
        el.setAttribute('aria-invalid', 'false');
        message.removeAttribute('role');
        message.removeAttribute('aria-live');
      }
    }
  }

  function decorateInputs() {
    var formEls = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea, .form-group fieldset');
    var formElsLen = formEls.length;

    for (var i = 0; i < formElsLen; i++) {
      var formEl = formEls[i];

      // Set an observer to listen for .invalid.
      var observer = new MutationObserver(function (mutations) { onClassMutation(mutations); });
      observer.observe(formEl, { subtree: false, attributes: true, attributeOldValue: true, attributeFilter: ['class'] });

      var messages = formEl.parentNode.querySelectorAll('.validation-message, .helper-text');
      var msgLen = messages.length;
      var describedByIds = '';

      for (var j = 0; j < msgLen; j++) {
        var thisMsg = messages[j];
        var id = 'rb-a11y_' + window.rb.getShortId();
        describedByIds += id + ' ';

        // Don't clobber any existing attributes!
        if (!thisMsg.id) {
          thisMsg.id = id;
        }
      }

      if (!formEl.hasAttribute('aria-describedby')) {
        formEl.setAttribute('aria-describedby', describedByIds.trim());
      }
    }
  }

  window.rb.onDocumentReady(decorateInputs);
})(window, document);
