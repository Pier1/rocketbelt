(function rocketbeltA11yButtonsDropdown(rb, document) {
  var aria = rb.aria;

  function decorateDropdowns() {
    var triggers = document.querySelectorAll('.button-dropdown_trigger');
    var triggersLen = triggers.length;

    var DEFAULT_BUTTON_SELECTOR = '.button, button';

    var onChange = function onFocusIn(e) {
      var input = e.target;
      var checked = input.checked;
      var ddContent = e.target.parentNode.querySelector('.button-dropdown_content');

      if (checked) {
        input.setAttribute(aria.expanded, true);
        ddContent.setAttribute(aria.hidden, false);
      } else {
        input.setAttribute(aria.expanded, false);
        ddContent.setAttribute(aria.hidden, true);
      }
    };

    for (var i = 0; i < triggersLen; i++) {
      var trigger = triggers[i];
      var label = trigger.parentNode.querySelector('label');
      var ddContent = trigger.parentNode.querySelector('.button-dropdown_content');
      var defaultButton = trigger.parentNode.querySelector(DEFAULT_BUTTON_SELECTOR);
      var ddLabelledBy = defaultButton.id ? defaultButton.id : 'rb-a11y_' + rb.getShortId();

      var icon = trigger.parentNode.querySelector('.button-dropdown_icon .icon');
      icon.setAttribute(aria.hidden, true);

      var triggerId = trigger.id ? trigger.id : 'rb-a11y_' + rb.getShortId();
      trigger.id = triggerId;
      label.setAttribute('for', triggerId);

      if (ddContent) {
        defaultButton.id = ddLabelledBy;

        trigger.setAttribute(aria.haspopup, true);
        trigger.setAttribute(aria.expanded, false);
        trigger.setAttribute(aria.label, 'Toggle Dropdown');

        ddContent.setAttribute(aria.hidden, true);
        ddContent.setAttribute(aria.labelledby, ddLabelledBy);
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

  rb.onDocumentReady(decorateDropdowns);
})(window.rb, document);
