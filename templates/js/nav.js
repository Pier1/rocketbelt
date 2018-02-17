(function (window, document, undefined) {
  'use strict';

  // Select nav items that have submenus
  var hasSubmenu = document.querySelectorAll('[aria-controls]');
  var active = 'active';
  var i = 0;

  // Show the submenu by toggling the relevant class names
  function showSubmenu (event) {
    // We lose reference of this when filtering the nav items
    var self = this;

    // Select the relevant submenu, by the data-id attribute
    var submenu = document.getElementById(self.getAttribute('aria-controls'));

    // Probably best to prevent clicks through
    event.preventDefault();

    // Referring to the submenu parentNode
    // find all elements that aren't the submenu and remove active class
    var otherSubmenu = Array.prototype.filter.call(
      submenu.parentNode.children,
      function(child) {
        if ( child !== submenu ) {
          removeChildClass(child);
        }
      });

    // Referring to the the nav item parentNode
    // find all elements that aren't the submenu and remove active class
    var otherItem = Array.prototype.filter.call(
      self.parentNode.children,
      function(child) {
        if ( child !== self ) {
          removeChildClass(child);
        }
      });

    self.classList.toggle(active);

    const offsetX = self.getBoundingClientRect().left;
    submenu.setAttribute('style', `left: ${offsetX}px;`);
    submenu.classList.toggle(active);
  }

  // Remove the active class
  function removeChildClass(el) {
    // Check if it exists, then remove
    if ( el.classList.contains(active) ) {
      el.classList.remove(active);
    }
  }

  // On clicks show submenus
  for ( i = 0; i < hasSubmenu.length; i++ ) {
    hasSubmenu[i].addEventListener('click', showSubmenu);
  }
})(window, document);
