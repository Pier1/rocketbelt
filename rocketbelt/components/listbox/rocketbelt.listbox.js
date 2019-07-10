/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
/**
 * @namespace aria
 */
var a11y = rb.a11y || {};

a11y.listbox = function (listboxNode, button) {
  this.listboxNode = listboxNode;
  this.button = button;
  this.activeDescendant = this.listboxNode.getAttribute('aria-activedescendant');
  this.multiselectable = this.listboxNode.hasAttribute('aria-multiselectable');
  this.moveUpDownEnabled = false;
  this.siblingList = null;
  this.upButton = null;
  this.downButton = null;
  this.moveButton = null;
  this.keysSoFar = '';
  this.handleFocusChange = function () {};
  this.handleItemChange = function (event, items) {};
  this.registerEvents();
};

a11y.listbox.prototype.registerEvents = function () {
  this.listboxNode.addEventListener('focus', this.setupFocus.bind(this));
  this.listboxNode.addEventListener('keydown', this.checkKeyPress.bind(this));
  this.listboxNode.addEventListener('click', this.checkClickItem.bind(this));
};

a11y.listbox.prototype.setupFocus = function () {
  if (this.activeDescendant) {
    return;
  }

  this.focusFirstItem();
};

a11y.listbox.prototype.focusFirstItem = function () {
  var firstItem;

  firstItem = this.listboxNode.querySelector('[role="option"]');

  if (firstItem) {
    this.focusItem(firstItem);
  }
};

a11y.listbox.prototype.focusLastItem = function () {
  var itemList = this.listboxNode.querySelectorAll('[role="option"]');

  if (itemList.length) {
    this.focusItem(itemList[itemList.length - 1]);
  }
};

a11y.listbox.prototype.checkKeyPress = function (evt) {
  var key = evt.which || evt.keyCode;
  var nextItem = document.getElementById(this.activeDescendant);

  if (!nextItem) {
    return;
  }

  switch (key) {
    case rb.keys.PAGE_UP:
    case rb.keys.PAGE_DOWN:
      if (this.moveUpDownEnabled) {
        evt.preventDefault();

        if (key === rb.keys.PAGE_UP) {
          this.moveUpItems();
        }
        else {
          this.moveDownItems();
        }
      }

      break;
    case rb.keys.UP:
    case rb.keys.DOWN:
      evt.preventDefault();

      if (this.moveUpDownEnabled && evt.altKey) {
        if (key === rb.keys.UP) {
          this.moveUpItems();
        }
        else {
          this.moveDownItems();
        }
        return;
      }

      if (key === rb.keys.UP) {
        nextItem = nextItem.previousElementSibling;
      }
      else {
        nextItem = nextItem.nextElementSibling;
      }

      if (nextItem) {
        this.focusItem(nextItem);
      }

      break;
    case rb.keys.HOME:
      evt.preventDefault();
      this.focusFirstItem();
      break;
    case rb.keys.END:
      evt.preventDefault();
      this.focusLastItem();
      break;
    case rb.keys.SPACE:
      evt.preventDefault();
      this.toggleSelectItem(nextItem);
      break;
    case rb.keys.BACKSPACE:
    case rb.keys.DELETE:
    case rb.keys.RETURN:
      if (!this.moveButton) {
        return;
      }

      var keyshortcuts = this.moveButton.getAttribute('aria-keyshortcuts');
      if (key === rb.keys.RETURN && keyshortcuts.indexOf('Enter') === -1) {
        return;
      }
      if (
        (key === rb.keys.BACKSPACE || key === rb.keys.DELETE) &&
        keyshortcuts.indexOf('Delete') === -1
      ) {
        return;
      }

      evt.preventDefault();

      var nextUnselected = nextItem.nextElementSibling;
      while (nextUnselected) {
        if (nextUnselected.getAttribute('aria-selected') != 'true') {
          break;
        }
        nextUnselected = nextUnselected.nextElementSibling;
      }
      if (!nextUnselected) {
        nextUnselected = nextItem.previousElementSibling;
        while (nextUnselected) {
          if (nextUnselected.getAttribute('aria-selected') != 'true') {
            break;
          }
          nextUnselected = nextUnselected.previousElementSibling;
        }
      }

      this.moveItems();

      if (!this.activeDescendant && nextUnselected) {
        this.focusItem(nextUnselected);
      }
      break;
    default:
      var itemToFocus = this.findItemToFocus(key);
      if (itemToFocus) {
        this.focusItem(itemToFocus);
      }
      break;
  }
};

a11y.listbox.prototype.findItemToFocus = function (key) {
  var itemList = this.listboxNode.querySelectorAll('[role="option"]');
  var character = String.fromCharCode(key);

  if (!this.keysSoFar) {
    for (var i = 0; i < itemList.length; i++) {
      if (itemList[i].getAttribute('id') == this.activeDescendant) {
        this.searchIndex = i;
      }
    }
  }
  this.keysSoFar += character;
  this.clearKeysSoFarAfterDelay();

  var nextMatch = this.findMatchInRange(
    itemList,
    this.searchIndex + 1,
    itemList.length
  );
  if (!nextMatch) {
    nextMatch = this.findMatchInRange(
      itemList,
      0,
      this.searchIndex
    );
  }
  return nextMatch;
};

a11y.listbox.prototype.clearKeysSoFarAfterDelay = function () {
  if (this.keyClear) {
    clearTimeout(this.keyClear);
    this.keyClear = null;
  }
  this.keyClear = setTimeout((function () {
    this.keysSoFar = '';
    this.keyClear = null;
  }).bind(this), 500);
};

a11y.listbox.prototype.findMatchInRange = function (list, startIndex, endIndex) {
  // Find the first item starting with the keysSoFar substring, searching in
  // the specified range of items
  for (var n = startIndex; n < endIndex; n++) {
    var label = list[n].innerText;
    if (label && label.toUpperCase().indexOf(this.keysSoFar) === 0) {
      return list[n];
    }
  }
  return null;
};

a11y.listbox.prototype.checkClickItem = function (evt) {
  if (evt.target.getAttribute('role') === 'option') {
    this.focusItem(evt.target);
    this.toggleSelectItem(evt.target);

    this.listboxButton.hideListbox();
  }
};

a11y.listbox.prototype.toggleSelectItem = function (element) {
  if (this.multiselectable) {
    element.setAttribute(
      'aria-selected',
      element.getAttribute('aria-selected') === 'true' ? 'false' : 'true'
    );

    if (this.moveButton) {
      if (this.listboxNode.querySelector('[aria-selected="true"]')) {
        this.moveButton.setAttribute('aria-disabled', 'false');
      }
      else {
        this.moveButton.setAttribute('aria-disabled', 'true');
      }
    }
  }
};

a11y.listbox.prototype.defocusItem = function (element) {
  if (!element) {
    return;
  }
  if (!this.multiselectable) {
    element.removeAttribute('aria-selected');
  }
  element.classList.remove('focused');
};

a11y.listbox.prototype.focusItem = function (element) {
  this.defocusItem(document.getElementById(this.activeDescendant));
  if (!this.multiselectable) {
    element.setAttribute('aria-selected', 'true');
  }
  element.classList.add('focused');
  this.listboxNode.setAttribute('aria-activedescendant', element.id);
  this.activeDescendant = element.id;

  if (this.listboxNode.scrollHeight > this.listboxNode.clientHeight) {
    var scrollBottom = this.listboxNode.clientHeight + this.listboxNode.scrollTop;
    var elementBottom = element.offsetTop + element.offsetHeight;
    if (elementBottom > scrollBottom) {
      this.listboxNode.scrollTop = elementBottom - this.listboxNode.clientHeight;
    }
    else if (element.offsetTop < this.listboxNode.scrollTop) {
      this.listboxNode.scrollTop = element.offsetTop;
    }
  }

  if (!this.multiselectable && this.moveButton) {
    this.moveButton.setAttribute('aria-disabled', false);
  }

  this.checkUpDownButtons();
  this.handleFocusChange(element);
};

a11y.listbox.prototype.checkUpDownButtons = function () {
  var activeElement = document.getElementById(this.activeDescendant);

  if (!this.moveUpDownEnabled) {
    return false;
  }

  if (!activeElement) {
    this.upButton.setAttribute('aria-disabled', 'true');
    this.downButton.setAttribute('aria-disabled', 'true');
    return;
  }

  if (this.upButton) {
    if (activeElement.previousElementSibling) {
      this.upButton.setAttribute('aria-disabled', false);
    }
    else {
      this.upButton.setAttribute('aria-disabled', 'true');
    }
  }

  if (this.downButton) {
    if (activeElement.nextElementSibling) {
      this.downButton.setAttribute('aria-disabled', false);
    }
    else {
      this.downButton.setAttribute('aria-disabled', 'true');
    }
  }
};

a11y.listbox.prototype.addItems = function (items) {
  if (!items || !items.length) {
    return false;
  }

  items.forEach((function (item) {
    this.defocusItem(item);
    this.toggleSelectItem(item);
    this.listboxNode.append(item);
  }).bind(this));

  if (!this.activeDescendant) {
    this.focusItem(items[0]);
  }

  this.handleItemChange('added', items);
};

a11y.listbox.prototype.deleteItems = function () {
  var itemsToDelete;

  if (this.multiselectable) {
    itemsToDelete = this.listboxNode.querySelectorAll('[aria-selected="true"]');
  }
  else if (this.activeDescendant) {
    itemsToDelete = [ document.getElementById(this.activeDescendant) ];
  }

  if (!itemsToDelete || !itemsToDelete.length) {
    return [];
  }

  itemsToDelete.forEach((function (item) {
    item.remove();

    if (item.id === this.activeDescendant) {
      this.clearActiveDescendant();
    }
  }).bind(this));

  this.handleItemChange('removed', itemsToDelete);

  return itemsToDelete;
};

a11y.listbox.prototype.clearActiveDescendant = function () {
  this.activeDescendant = null;
  this.listboxNode.setAttribute('aria-activedescendant', null);

  if (this.moveButton) {
    this.moveButton.setAttribute('aria-disabled', 'true');
  }

  this.checkUpDownButtons();
};

a11y.listbox.prototype.moveUpItems = function () {
  var previousItem;

  if (!this.activeDescendant) {
    return;
  }

  currentItem = document.getElementById(this.activeDescendant);
  previousItem = currentItem.previousElementSibling;

  if (previousItem) {
    this.listboxNode.insertBefore(currentItem, previousItem);
    this.handleItemChange('moved_up', [ currentItem ]);
  }

  this.checkUpDownButtons();
};

a11y.listbox.prototype.moveDownItems = function () {
  var nextItem;

  if (!this.activeDescendant) {
    return;
  }

  currentItem = document.getElementById(this.activeDescendant);
  nextItem = currentItem.nextElementSibling;

  if (nextItem) {
    this.listboxNode.insertBefore(nextItem, currentItem);
    this.handleItemChange('moved_down', [ currentItem ]);
  }

  this.checkUpDownButtons();
};

a11y.listbox.prototype.moveItems = function () {
  if (!this.siblingList) {
    return;
  }

  var itemsToMove = this.deleteItems();
  this.siblingList.addItems(itemsToMove);
};

a11y.listbox.prototype.enableMoveUpDown = function (upButton, downButton) {
  this.moveUpDownEnabled = true;
  this.upButton = upButton;
  this.downButton = downButton;
  upButton.addEventListener('click', this.moveUpItems.bind(this));
  downButton.addEventListener('click', this.moveDownItems.bind(this));
};

a11y.listbox.prototype.setupMove = function (button, siblingList) {
  this.siblingList = siblingList;
  this.moveButton = button;
  button.addEventListener('click', this.moveItems.bind(this));
};

a11y.listbox.prototype.setHandleItemChange = function (handlerFn) {
  this.handleItemChange = handlerFn;
};

a11y.listbox.prototype.setHandleFocusChange = function (focusChangeHandler) {
  this.handleFocusChange = focusChangeHandler;
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

window.addEventListener('load', function () {
  var button = document.querySelector('.listbox_button');
  var exListbox = new a11y.listbox(document.querySelector('.listbox_items'));
  var listboxButton = new a11y.listboxButton(button, exListbox);
  exListbox.listboxButton = listboxButton;
});

a11y.listboxButton = function (button, listbox) {
  this.button = button;
  this.listbox = listbox;
  this.registerEvents();
};

a11y.listboxButton.prototype.registerEvents = function () {
  this.button.addEventListener('click', this.showListbox.bind(this)); // Toggle instead of show only
  this.button.addEventListener('keyup', this.checkShow.bind(this));
  this.listbox.listboxNode.addEventListener('blur', this.hideListbox.bind(this));
  this.listbox.listboxNode.addEventListener('keydown', this.checkHide.bind(this));
  this.listbox.setHandleFocusChange(this.onFocusChange.bind(this));
};

a11y.listboxButton.prototype.checkShow = function (evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case rb.keys.UP:
    case rb.keys.DOWN:
      evt.preventDefault();
      this.showListbox();
      this.listbox.checkKeyPress(evt);
      break;
  }
};

a11y.listboxButton.prototype.checkHide = function (evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case rb.keys.RETURN:
    case rb.keys.ESC:
      evt.preventDefault();
      this.hideListbox();
      this.button.focus();
      break;
  }
};

a11y.listboxButton.prototype.showListbox = function () {
  this.listbox.listboxNode.classList.remove('hidden');
  this.button.setAttribute('aria-expanded', 'true');
  this.listbox.listboxNode.focus();
};

a11y.listboxButton.prototype.hideListbox = function () {
  this.listbox.listboxNode.classList.add('hidden');
  this.button.removeAttribute('aria-expanded');
};

a11y.listboxButton.prototype.onFocusChange = function (focusedItem) {
  this.button.innerText = focusedItem.innerText;
};
