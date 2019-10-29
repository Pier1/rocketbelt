'use strict';

((rb, document, $) => {
  window.rb = window.rb || {};

  const expanders = document.querySelectorAll('.expander');

  Array.prototype.forEach.call(expanders, (expander) => {
    expander.innerHTML = `
        <button class="button button-minimal" aria-expanded="false">
          ${expander.textContent}
        </button>
      `;

    // Get all content between this .expander and the next
    const getContent = (elem) => {
      const elems = [];
      while (
        elem.nextElementSibling &&
        (elem.nextElementSibling.classList.length === 0 ||
          (elem.nextElementSibling.classList &&
            !elem.nextElementSibling.classList.contains('expander')))
      ) {
        elems.push(elem.nextElementSibling);
        elem = elem.nextElementSibling;
      }

      elems.forEach((node) => {
        node.parentNode.removeChild(node);
      });

      return elems;
    };

    const contents = getContent(expander);

    const wrapper = document.createElement('div');
    wrapper.hidden = true;

    contents.forEach((node) => {
      wrapper.appendChild(node);
    });

    expander.parentNode.insertBefore(wrapper, expander.nextElementSibling);

    const btn = expander.querySelector('button');

    btn.onclick = () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true' || false;
      btn.setAttribute('aria-expanded', !expanded);
      wrapper.hidden = expanded;
    };
  });
})(window.rb, document, jQuery);
