(function () {
  function generateShortId() {
    // Break the id into 2 parts to provide enough bits to the random number.
    // This should be unique up to 1:2.2 bn.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ('000' + firstPart.toString(36)).slice(-3);
    secondPart = ('000' + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  }

  function decorateInputs() {
    var formEls = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea, .form-group fieldset');
    var formElsLen = formEls.length;

    for (var i = 0; i < formElsLen; i++) {
      var formEl = formEls[i];
      var siblings = Array.prototype.filter.call(formEl.parentNode.children, function (child) {
        return child !== formEl;
      });
      var sibLen = siblings.length;

      for (var j = 0; j < sibLen; j++) {
        var thisSib = siblings[j];

        if (thisSib.classList.contains('messages') || thisSib.classList.contains('validation-message')) {
          // Don't clobber any existing attributes!
          if (!formEl.hasAttribute('aria-describedby') && !thisSib.id) {
            // Decorate input & this sibling
            var id = 'rb-a11y-' + generateShortId();
            formEl.setAttribute('aria-describedby', id);
            thisSib.id = id;
          }
        }
      }
    }
  }

  if (
    document.readyState === 'complete' ||
    (document.readyState !== 'loading' && !document.documentElement.doScroll)
  ) {
    decorateInputs();
  } else {
    document.addEventListener('DOMContentLoaded', decorateInputs);
  }
})();
