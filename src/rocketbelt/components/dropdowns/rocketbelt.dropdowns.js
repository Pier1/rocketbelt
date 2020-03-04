'use strict';
((rb, document) => {
  const aria = rb.aria;
  const keys = rb.keys;

  const onKeyDown = function(e) {
    const $dropdown = $(e.srcElement).closest('.dropdown');
    const $options = $dropdown.find('.dropdown_option');
    let $selectedOption = $options.filter('[aria-selected="true"]');

    switch (e.which) {
      case keys.ARROW_UP:
        const $prev = $selectedOption[0]
          ? $selectedOption.prev()
          : $options.last();
        focusItem($prev);
        break;
      case keys.ARROW_DOWN:
        const $next = $selectedOption[0]
          ? $selectedOption.next()
          : $options.first();
        focusItem($next);
        break;
      case keys.HOME:
        focusItem($options.first());
        break;
      case keys.END:
        focusItem($options.last());
        break;
      case keys.ESC:
        toggleDropdown($dropdown);
        break;
      case keys.ENTER:
        // keys.ENTER gets picked up as a click by the button click handler in
        // decorateDropdowns, so we won't close it with this focusItem call.
        focusItem($selectedOption, {
          closeAfterFocus: false,
          selectAfterFocus: true,
        });
        break;
    }
  };

  const clickOutsideHandler = function($dropdown) {
    closeDropdown($dropdown);
  };

  const closeDropdown = ($dropdown) => {
    const $button = $dropdown.find('.dropdown_button');

    $dropdown.removeClass('dropdown-open');
    $button.removeAttr(aria.expanded);

    unfocusDropdown($dropdown);

    $dropdown[0].removeEventListener('keydown', onKeyDown);

    rb.onClickOutside(
      $dropdown[0],
      () => {
        clickOutsideHandler($dropdown);
      },
      // TODO: Removes the handler. Maybe refactor what this call looks like?
      true
    );
  };

  const toggleDropdown = ($dropdown) => {
    const $button = $dropdown.find('.dropdown_button');

    if ($dropdown.hasClass('dropdown-open')) {
      $dropdown.removeClass('dropdown-open');
      closeDropdown($dropdown);
    } else {
      $dropdown.addClass('dropdown-open');
      $button.attr(aria.expanded, true);
      $dropdown[0].addEventListener('keydown', onKeyDown);

      const selectedOptionId = $button.attr('data-rb-selected-id');
      if (selectedOptionId) {
        focusItem($(`#${selectedOptionId}`));
      }

      rb.onClickOutside($dropdown[0], () => {
        clickOutsideHandler($dropdown);
      });
    }
  };

  const scrollToItem = ($dropdownOption) => {
    if ($dropdownOption[0]) {
      const parent = $dropdownOption[0].offsetParent;
      const $pos = $dropdownOption.position();

      let scrollTop;

      if ($pos.top < 0) {
        scrollTop = $dropdownOption[0].offsetTop;
      } else if (
        parent &&
        $pos.top + $dropdownOption[0].scrollHeight > parent.offsetHeight
      ) {
        const diff = parent
          ? $pos.top + $dropdownOption[0].scrollHeight - parent.offsetHeight
          : 0;
        scrollTop = parent ? parent.scrollTop + diff : 0;
      }

      if (scrollTop !== undefined) {
        $(parent).animate({ scrollTop: scrollTop }, 100, 'linear');
      }
    }
  };

  const unfocusDropdown = ($dropdown) => {
    const $list = $dropdown.find('.dropdown_list');
    const $options = $dropdown.find('.dropdown_option');

    $list.removeAttr(aria.activedescendant);
    $options.removeAttr(aria.selected);
  };

  const focusItem = (
    $dropdownOption,
    { closeAfterFocus = false, selectAfterFocus = false } = {}
  ) => {
    const $dropdown = $dropdownOption.closest('.dropdown');
    const $options = $dropdown.find('.dropdown_option');

    $options.removeAttr(aria.selected);
    $dropdownOption.attr(aria.selected, true);

    $dropdownOption
      .closest('.dropdown_list')
      .attr(aria.activedescendant, $dropdownOption.attr('id'));

    scrollToItem($dropdownOption);

    if (selectAfterFocus) {
      const $button = $dropdown.find('.dropdown_button');
      $button.attr('data-rb-selected-id', $dropdownOption.attr('id'));
      $button.html($dropdownOption.html());
    }

    if (closeAfterFocus) {
      closeDropdown($dropdown);
    }
  };

  const decorateDropdowns = () => {
    $('.dropdown').each(function(i, el) {
      const $dropdown = $(el);
      const $label = $dropdown.find('.dropdown_label');
      const $button = $dropdown.find('.dropdown_button');
      const $list = $dropdown.find('.dropdown_list');

      !$label.attr('id') && $label.attr('id', `rb_${rb.getShortId()}`);
      !$button.attr('id') && $button.attr('id', `rb_${rb.getShortId()}`);
      !$list.attr('id') && $list.attr('id', `rb_${rb.getShortId()}`);

      const labelId = $label.attr('id');
      const buttonId = $button.attr('id');
      const listId = $list.attr('id');

      $button.attr(aria.labelledby, `${labelId} ${buttonId}`);
      $button.attr(aria.haspopup, 'listbox');

      $button.on('click', function(e) {
        toggleDropdown($dropdown);
      });

      $list.attr(aria.role, 'listbox');
      $list.attr(aria.labelledby, labelId);
      $list.attr('tabindex', -1);

      const $options = $dropdown.find('.dropdown_option');

      $options.each(function(j, opt) {
        const $opt = $(opt);
        !$opt.attr('id') && $opt.attr('id', `rb_${rb.getShortId()}`);

        $opt.attr(aria.role, 'option');
      });

      $options.on('click', function(e) {
        focusItem($(e.target).closest('.dropdown_option'), {
          closeAfterFocus: true,
          selectAfterFocus: true,
        });
      });
    });
  };

  rb.onDocumentReady(decorateDropdowns);

  rb.dropdowns = rb.dropdowns || {};
  rb.dropdowns.decorateDropdowns = decorateDropdowns;
  rb.dropdowns.toggleDropdown = toggleDropdown;
  rb.dropdowns.focusItem = focusItem;
  rb.dropdowns.unfocusDropdown = unfocusDropdown;
})(window.rb, document);
