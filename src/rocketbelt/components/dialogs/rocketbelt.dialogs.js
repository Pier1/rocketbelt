/* global $cache:true element:true closers:true */
$(function() {
  decorateDialogParent();

  var options = initOptions();
  var focusedBeforeDialog;
  var scrollBeforeDialog;
  // IE doesn't apply append var to the global scope.
  var $cache = {
    appendTo: $(options.appendTo),
    blurElement: $(options.blurElement),
    rbDialog: $('.dialog').last(),
    rbDialogTitle: $('.dialog .dialog_title').last(),
    rbDialogBody: $('.dialog .dialog_body').last(),
  };
  var element = null;
  var closers = $($cache.rbDialog).find('[data-rb-dialog-hide]');

  function initOptions() {
    return {
      appendTo: 'body',
      blurElement: 'body>div:first',
      autoOpen: true,
      buttons: [],
      classes: {
        rbDialog: 'dialog',
        rbDialogTitle: 'dialog_title',
        rbDialogBody: 'dialog_body',
      },
      title: null,
      beforeClose: null,
      close: null,
      open: null,
      required: false,
      headerless: false,
    };
  }

  /**
   * rbDialog constructor
   * @param {Object|string} [params] - Either the options object or function call as a string
   * @returns {undefined} Returns undefined
   * @description Pops a Rocketbelt modal
   */
  $.fn.rbDialog = function(params) {
    if (typeof params !== 'string') init.call(this, params);
    if (params === 'close') close();
    else if (params === 'destroy') destroy();
    else if (params === 'open' || options.autoOpen) open();
    else if (params === 'options') return options;
    else if (params === 'isOpen')
      return $cache.appendTo.hasClass('is-dialog-open');
    return null;
  };

  function init(params) {
    if ($cache.appendTo.hasClass('is-dialog-open')) return;
    if (this.hasOwnProperty('defaultElement')) {
      element = $(this.defaultElement);
    } else if (this) {
      element = $(this);
    } else {
      element = $(element);
    }

    $.extend(true, options, params);

    if (options.required) options.classes['rbDialog'] += ' dialog_required';

    if (options.headerless) {
      options.classes['rbDialog'] += ' dialog_headerless';
    }

    if (options.appendTo) $cache.appendTo = $(options.appendTo);
    if (options.blurElement) $cache.blurElement = $(options.blurElement);
    if (options.title) $cache.rbDialogTitle.html(options.title);
    if (options.classes) addDialogClasses();
    if (options.buttons.length !== 0) addDialogButtons();

    $cache.rbDialog.data('options', options);
    $.each(closers, function(index, el) {
      if ($(el).is('.dialog_close')) {
        $(el).addClass('button button-minimal');
      }

      if (options.required && $(el).is('.dialog_overlay, .dialog_close'))
        return;

      el.addEventListener('click', close);
    });
    if (!$.contains($cache.rbDialogBody[0], element[0])) {
      $cache.rbDialogBody.append(element);
    }
    element.show();
  }

  function addDialogClasses() {
    if (options.classes.rbDialog) {
      if (options.classes.rbDialog !== 'dialog')
        $cache.rbDialog.attr('class', 'dialog ' + options.classes.rbDialog);
      else $cache.rbDialog.attr('class', 'dialog');
    }
    if (options.classes.rbDialogTitle)
      $cache.rbDialogTitle.addClass(options.classes.rbDialogTitle);
    if (options.classes.rbDialogBody)
      $cache.rbDialogBody.addClass(options.classes.rbDialogBody);
  }

  function addDialogButtons() {
    var buttons = options.buttons;

    // If we already have a button pane, remove it

    if (
      $.isEmptyObject(buttons) ||
      ($.isArray(buttons) && !buttons.length) ||
      options.classes.rbDialog.indexOf('dialog-max') !== -1
    ) {
      return;
    }

    if ($cache.rbDialogButtons) $cache.rbDialogButtons.remove();
    $('.dialog_content').append($('<div class="dialog_buttons"></div>'));
    $cache.rbDialogButtons = $('.dialog_buttons');

    $.each(buttons, function(name, props) {
      var click;
      var buttonOptions;
      props = $.isFunction(props) ? { click: props, text: name } : props;

      // Default to a non-submitting button
      props = $.extend({ type: 'button' }, props);

      if (buttons.length === 1) {
        // Button is implicitly primary if there's only one button.
        if (
          !props.classes ||
          (props.classes &&
            props.classes.length > 0 &&
            !props.classes.indexOf('button-primary') > -1)
        ) {
          props.classes = props.classes + ' button-primary';
        }
      }
      // Change the context for the click callback to be the main element
      click = props.click;
      buttonOptions = {
        class: 'button ' + props.classes,
        text: props.text,
      };

      delete props.click;
      delete props.classes;
      if (typeof props.text === 'boolean') {
        delete props.text;
      }

      $('<button></button>', props)
        .attr('class', buttonOptions.class)
        .text(buttonOptions.text)
        .appendTo($cache.rbDialogButtons)
        .on('click', function() {
          click.apply($cache.rbDialog, arguments[0]);
        });
    });
  }

  function getFocusableChildren(node) {
    var focusableElements = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
    ];
    return $(node).find(focusableElements.join(','));
  }

  // Helper function trapping the tab key inside a node
  function trapTabKey(node, event) {
    var focusableChildren = getFocusableChildren(node);
    var focusedItemIndex = focusableChildren.index($(document.activeElement));

    if (event.shiftKey && focusedItemIndex === 0) {
      focusableChildren[focusableChildren.length - 1].focus();
      event.preventDefault();
    } else if (
      !event.shiftKey &&
      focusedItemIndex === focusableChildren.length - 1
    ) {
      focusableChildren[0].focus();
      event.preventDefault();
    }
  }

  function setFocusToFirstItem(node) {
    var focusableChildren = getFocusableChildren(node);
    if (focusableChildren.length) focusableChildren[0].focus();
  }

  function bindKeypress(event) {
    var shown = !$cache.rbDialog[0].hasAttribute('aria-hidden');
    if (shown && !options.required && event.which === 27) {
      event.preventDefault();
      close();
    }

    if (shown && event.which === 9) {
      trapTabKey($cache.rbDialog, event);
    }
  }

  function maintainFocus(event) {
    var target;
    if (event) {
      if (event.target) {
        target = event.target;
      } else if (event.srcElement) {
        target = event.srcElement;
      }
    }

    if (
      !$cache.rbDialog[0].hasAttribute('aria-hidden') &&
      !$cache.rbDialog[0].contains(target)
    ) {
      setFocusToFirstItem($cache.rbDialog);
    }
  }

  function open() {
    if ($cache.appendTo.hasClass('is-dialog-open')) return;

    const $d = $($cache.rbDialog[0]).find('.dialog_content');
    $d.removeAttr('style');

    // Preserve scroll position
    scrollBeforeDialog = $(window).scrollTop();
    $cache.appendTo.css('top', '-' + scrollBeforeDialog + 'px');

    $cache.appendTo.addClass('is-dialog-open');
    $cache.blurElement.addClass('dialog_blur').attr('aria-hidden', true);
    $cache.rbDialog.removeAttr('aria-hidden');
    focusedBeforeDialog = $(document.activeElement);
    setFocusToFirstItem($cache.rbDialog[0]);
    document.body.addEventListener('focus', maintainFocus, true);
    $(document).keydown(bindKeypress);

    var $dialog = $($cache.rbDialog[0]);
    var $footer = $dialog.find('.dialog_footer');

    if ($footer.length > 0) {
      $footer.detach();

      const $body = $dialog.find('.dialog_body');
      $footer.insertAfter($body);
    }

    if (
      $cache.rbDialog[0] &&
      $cache.rbDialog[0].classList &&
      $cache.rbDialog[0].classList.contains('dialog_headerless')
    ) {
      var $closeContainer = $(
        '.dialog_headerless .dialog_close_container'
      ).detach();
      var $headerlessDialog = $('.dialog_headerless .dialog_content');

      if (!$headerlessDialog.children('.dialog_close_container').length) {
        $closeContainer.insertAfter(
          '.dialog_headerless .dialog_content .dialog_header'
        );
      }
    }

    if (window.devicePixelRatio < 2) {
      rb.onAnimationEnd(
        $cache.rbDialog[0],
        (e) => recenterDialog(e.target),
        true
      );

      window.addEventListener('rb.optimizedResize', recenterDialog);
    }

    $cache.rbDialog.trigger('rbDialog:open');
    _trigger('open');
  }

  const recenterDialog = (el) => {
    const $dialog = $($cache.rbDialog[0]).find('.dialog_content');

    const position = $dialog.position();
    const width = $dialog.width();

    const $window = $(window);

    const win = {
      height: $window.height(),
      width: $window.width(),
    };

    const dialog = {
      height: $dialog.height(),
      width: $dialog.width(),
    };

    const top = (win.height - dialog.height) / 2;
    const left = (win.width - dialog.width) / 2;

    $dialog.css({
      transform: 'none',
      position: 'fixed',
      top: Math.round(top),
      left: Math.round(left),
      width: width,
    });
  };

  function close() {
    _trigger('beforeClose');

    if (window.devicePixelRatio < 2) {
      window.removeEventListener('rb.optimizedResize', recenterDialog);

      const $dialog = $($cache.rbDialog[0]).find('.dialog_content');

      $dialog.css({
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
      });
    }

    if ($cache.rbDialog[0].hasAttribute('aria-hidden')) return;

    $cache.appendTo.removeClass('is-dialog-open');

    // Preserve scroll position
    $cache.appendTo.css('top', '0');
    $(window).scrollTop(scrollBeforeDialog);

    $cache.blurElement.removeClass('dialog_blur').removeAttr('aria-hidden');
    $cache.rbDialog.attr('aria-hidden', 'true');
    focusedBeforeDialog && focusedBeforeDialog.focus();
    document.body.removeEventListener('focus', maintainFocus, true);
    document.removeEventListener('keydown', bindKeypress);

    // Remove closing
    $.each(closers, function(index, value) {
      value.removeEventListener('click', close);
    });

    $cache.rbDialog.trigger('rbDialog:close');
    _trigger('close');
    destroy();
  }

  function destroy() {
    if (document.body.style.animation) {
      $cache.rbDialog.one(
        'webkitAnimationEnd oanimationend msAnimationEnd animationend',
        function() {
          setTimeout(destroyTheWorld, 200);
        }
      );
    } else {
      setTimeout(destroyTheWorld, 200);
    }
  }

  function destroyTheWorld() {
    if ($cache.rbDialogButtons) $cache.rbDialogButtons.remove();
    $cache.appendTo.append(
      $cache.rbDialogBody
        .children('*')
        .detach()
        .hide()
    );
    $cache.rbDialogTitle.text('');
    options = initOptions();
  }

  function _trigger(type, event, data) {
    var prop;
    var orig;
    var callback = options[type];

    data = data || {};
    event = $.Event(event);
    if (this) {
      event.type = (type === this.widgetEventPrefix
        ? type
        : this.widgetEventPrefix + type
      ).toLowerCase();
    } else {
      event.type = type;
    }
    // the original event may come from any element
    // so we need to reset the target on the new event
    event.target = element[0];

    // copy original event properties over to the new event
    orig = event.originalEvent;
    if (orig) {
      for (prop in orig) {
        if (!(prop in event)) {
          event[prop] = orig[prop];
        }
      }
    }

    element.trigger(event, data);
    return !(
      ($.isFunction(callback) &&
        callback.apply(element[0], [event].concat(data)) === false) ||
      event.isDefaultPrevented()
    );
  }

  function decorateDialogParent() {
    const parent = $('#dialog_parent');

    if (parent.length > 0 && parent.children().length === 0) {
      parent.addClass('dialog');
      parent.attr('tabindex', 0);
      parent.attr('aria-hidden', 'true');

      const innerHTML = `
          <div class="dialog_overlay" tabindex="-1" data-rb-dialog-hide=""></div>
          <section class="dialog_content grid-fluid" aria-labelledby="dialog_title" aria-describedby="dialog_description" role="dialog">
            <header class="dialog_header">
              <h2 class="dialog_title" id="dialog_title"></h2>
              <div class="dialog_close_container">
                <button class="dialog_close dialog_close-icon" data-rb-dialog-hide="" aria-label="Close dialog"></button>
              </div>
            </header>
            <div class="dialog_body"></div>
          </section>
        `;

      parent.html(innerHTML);
    }
  }

  $(document).ready(function() {
    decorateDialogParent();
  });

  window.rb = window.rb || {};
  window.rb.dialogs = window.rb.dialogs || {};
  window.rb.dialogs.decorateDialogParent = decorateDialogParent;
});
