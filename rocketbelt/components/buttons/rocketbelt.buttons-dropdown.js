(function rocketbeltA11yButtonsDropdown(window, document) {
  function decorateDropdowns() {
    var triggers = document.querySelectorAll('.button-dropdown_trigger');
    var triggersLen = triggers.length;

    var DEFAULT_BUTTON_SELECTOR = '.button, button';
    var ARIA_EXPANDED = 'aria-expanded';
    var ARIA_HIDDEN = 'aria-hidden';

    var onChange = function onFocusIn(e) {
      var input = e.target;
      var checked = input.checked;
      var ddContent = e.target.parentNode.querySelector('.button-dropdown_content');

      if (checked) {
        input.setAttribute(ARIA_EXPANDED, true);
        ddContent.setAttribute(ARIA_HIDDEN, false);
      } else {
        input.setAttribute(ARIA_EXPANDED, false);
        ddContent.setAttribute(ARIA_HIDDEN, true);
      }
    };

    for (var i = 0; i < triggersLen; i++) {
      var trigger = triggers[i];
      var label = trigger.parentNode.querySelector('label');
      var ddContent = trigger.parentNode.querySelector('.button-dropdown_content');
      var defaultButton = trigger.parentNode.querySelector(DEFAULT_BUTTON_SELECTOR);
      var ddLabelledBy = defaultButton.id ? defaultButton.id : 'rb-a11y_' + window.rb.getShortId();

      var icon = trigger.parentNode.querySelector('.button-dropdown_icon .icon');
      icon.setAttribute(ARIA_HIDDEN, true);

      var triggerId = trigger.id ? trigger.id : 'rb-a11y_' + window.rb.getShortId();
      trigger.id = triggerId;
      label.setAttribute('for', triggerId);

      if (ddContent) {
        defaultButton.id = ddLabelledBy;

        trigger.setAttribute('aria-haspopup', true);
        trigger.setAttribute(ARIA_EXPANDED, false);
        trigger.setAttribute('aria-label', 'Toggle Dropdown');

        ddContent.setAttribute(ARIA_HIDDEN, true);
        ddContent.setAttribute('aria-labellededby', ddLabelledBy);
      }

      trigger.addEventListener('change', function change(e) { onChange(e); });
    }

    document.addEventListener('click', function onclick(e) {
      var path = e.path;
      var pathLen = path.length;
      var shouldClose = true;

      for (var j = 0; j < pathLen; j++) {
        var el = path[j];

        if (el.classList && (el.classList.contains('button-dropdown_content') || el.classList.contains('button-dropdown_icon') || el.classList.contains('button-dropdown_trigger'))) {
          shouldClose = false;
          break;
        }
      }

      if (shouldClose) {
        var ddTriggers = document.querySelectorAll('.button-dropdown_trigger');
        var ddTriggersLen = ddTriggers.length;

        for (var k = 0; k < ddTriggersLen; k++) {
          ddTriggers[k].checked = false;
        }
      }
    });
  }

  window.rb.onDocumentReady(decorateDropdowns);
})(window, document);
