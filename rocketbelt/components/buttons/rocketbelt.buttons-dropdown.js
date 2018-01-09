'use strict';
((rb, document) => {
  const aria = rb.aria;

  function decorateDropdowns() {
    const triggers = document.querySelectorAll('.button-dropdown_trigger');
    const triggersLen = triggers.length;

    const DEFAULT_BUTTON_SELECTOR = '.button, button';

    const onChange = (e) => {
      const input = e.target;
      const checked = input.checked;
      const ddContent = e.target.parentNode.querySelector('.button-dropdown_content');

      if (checked) {
        input.setAttribute(aria.expanded, true);
        ddContent.setAttribute(aria.hidden, false);
      } else {
        input.setAttribute(aria.expanded, false);
        ddContent.setAttribute(aria.hidden, true);
      }
    };

    for (let i = 0; i < triggersLen; i++) {
      const trigger = triggers[i];
      const label = trigger.parentNode.querySelector('label');
      const ddContent = trigger.parentNode.querySelector('.button-dropdown_content');
      const defaultButton = trigger.parentNode.querySelector(DEFAULT_BUTTON_SELECTOR);
      const ddLabelledBy = defaultButton.id ? defaultButton.id : `rb-a11y_${rb.getShortId()}`;

      const icon = trigger.parentNode.querySelector('.button-dropdown_icon .icon');
      icon.setAttribute(aria.hidden, true);

      const triggerId = trigger.id ? trigger.id : `rb-a11y_${rb.getShortId()}`;
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

      trigger.addEventListener('change', (e) => { onChange(e); });
    }

    document.addEventListener('click', (e) => {
      const el = $(e.target);
      if (!el.closest('.button-dropdown').length && !el.is('.button-dropdown')) {
        const ddTriggers = document.querySelectorAll('.button-dropdown_trigger');
        const ddTriggersLen = ddTriggers.length;
        for (let k = 0; k < ddTriggersLen; k++) {
          ddTriggers[k].checked = false;
        }
      }
    });
  }

  rb.onDocumentReady(decorateDropdowns);
  rb.buttons = rb.buttons || {};
  rb.buttons.decorateDropdowns = decorateDropdowns;
})(window.rb, document);
