(function rocketbeltA11yForms(window, document) {
  function decorateInputs() {
    var formEls = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea, .form-group fieldset');
    var formElsLen = formEls.length;

    for (var i = 0; i < formElsLen; i++) {
      var formEl = formEls[i];

      var siblings = Array.prototype.filter.call(formEl.parentNode.children, function isSibling(child) {
        return child !== formEl;
      });
      var sibLen = siblings.length;

      // Set an observer to listen for .invalid.
      var observer = new MutationObserver(function onMutation(mutations) {
        var mutationsLen = mutations.length;

        for (var k = 0; k < mutationsLen; k++) {
          var mutation = mutations[k];
          // if oldvalue !== invalid && class list contains invalid
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (mutation.oldValue !== 'invalid' && mutation.target.classList.contains('invalid')) {
              console.dir(mutation);
              // Do the decoratin'
              if (!formEl.hasAttribute('aria-invalid')) {
                formEl.setAttribute('aria-invalid', 'true');
              }
                // role='alert' & aria-live='polite' on the message
            } else if (mutation.oldValue !== 'invalid' && !mutation.target.classList.contains('invalid')) {
                    // remove aria-invalid, role, aria-live
            }
          }
        }
      });

      observer.observe(formEl, { attributes: true, attributeOldValue: true });

//

      for (var j = 0; j < sibLen; j++) {
        var thisSib = siblings[j];

        if (thisSib.classList.contains('messages') || thisSib.classList.contains('validation-message')) {
          // Don't clobber any existing attributes!
          if (!formEl.hasAttribute('aria-describedby') && !thisSib.id) {
            // Decorate input & this sibling
            var id = 'rb-a11y-' + window.rb.getShortId();
            formEl.setAttribute('aria-describedby', id);
            thisSib.id = id;
          }
        }
      }
    }
  }

  window.rb.onDocumentReady(decorateInputs);
})(window, document);
