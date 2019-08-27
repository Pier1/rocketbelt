'use strict';
((rb, document, $) => {
  rb.typography = rb.typography || {};

  const clamp = (target, numLines, opts) => {
    const lineHeight =
      getComputedStyle(document.querySelectorAll(target)[0]).lineHeight.replace('px', '');
    const maxHeight = numLines * lineHeight;

    shave(target, maxHeight, opts);

    const els = document.querySelectorAll(target);
    els.forEach((el) => {
      el.dispatchEvent(new CustomEvent('rb.typography.clamp'));

      if (opts) {
        if (opts.onClamp) {
          opts.onClamp(el);
        }

        if (opts.onUnclamp) {
          rb.once(el, 'rb.typography.unclamp', opts.onUnclamp);
        }
      }

      const button = el.querySelector('button');
      if (button) {
        $(button).click(function buttonClick() {
          rb.typography.unclamp($(this).closest('.clampable-clamped').first());
        });
      }
    });
  };

  const shave = (target, maxHeight, opts = {}) => {
    /* eslint-disable */
    /**
      shave - Shave is a javascript plugin that truncates multi-line text within a html element based on set max height
      @version v2.4.0
      @link https://github.com/dollarshaveclub/shave#readme
      @author Jeff Wainwright <yowainwright@gmail.com> (jeffry.in)
      @license MIT
    **/
    if (!maxHeight) throw Error('maxHeight is required')
    let els = (typeof target === 'string') ? document.querySelectorAll(target) : target
    if (!els) return

    const character = opts.character || '…'
    const classname = opts.classname || 'clampable_clamped-text'
    const charClassname = 'clampable_clamped-placeholder'
    const truncationMarkup = opts.clampedMarkup
    const spaces = typeof opts.spaces === 'boolean' ? opts.spaces : true
    const charHtml =
      truncationMarkup ?
        `<span class="${charClassname}">… ${truncationMarkup}</span>` :
        `<span class="${charClassname}">${character}</span>`

    if (!('length' in els)) els = [els]
    for (let i = 0; i < els.length; i += 1) {
      const el = els[i]
      el.classList.add('clampable-clamped');

      const styles = el.style
      const span = el.querySelector(`.${classname}`)
      const textProp = el.textContent === undefined ? 'innerText' : 'textContent'

      // If element text has already been shaved
      if (span) {
        // Remove the ellipsis to recapture the original text
        el.removeChild(el.querySelector(`.${charClassname}`))
        el[textProp] = el[textProp] // eslint-disable-line
        // nuke span, recombine text
      }

      const fullText = el[textProp]
      const words = spaces ? fullText.split(' ') : fullText
      // If 0 or 1 words, we're done
      if (words.length < 2) continue

      // Temporarily remove any CSS height for text height calculation
      const heightStyle = styles.height
      styles.height = 'auto'
      const maxHeightStyle = styles.maxHeight
      styles.maxHeight = 'none'

      // If already short enough, we're done
      if (el.offsetHeight <= maxHeight) {
        styles.height = heightStyle
        styles.maxHeight = maxHeightStyle
        continue
      }

      if (maxHeight === 'auto') {
        styles.maxHeight = maxHeightStyle
        continue
      }

      // Binary search for number of words which can fit in allotted height
      let max = words.length - 1
      let min = 0
      let pivot
      while (min < max) {
        pivot = (min + max + 1) >> 1 // eslint-disable-line no-bitwise
        el[textProp] = spaces ? words.slice(0, pivot).join(' ') : words.slice(0, pivot)
        el.insertAdjacentHTML('beforeend', charHtml)
        if (el.offsetHeight > maxHeight) max = spaces ? pivot - 1 : pivot - 2
        else min = pivot
      }

      el[textProp] = spaces ? words.slice(0, max).join(' ') : words.slice(0, max)
      el.insertAdjacentHTML('beforeend', charHtml)
      const diff = spaces ? ` ${words.slice(max).join(' ')}` : words.slice(max)

      el.insertAdjacentHTML(
        'beforeend',
        `<span class="${classname}" style="display:none;">${diff}</span>`
      );

      styles.height = heightStyle;
      styles.maxHeight = maxHeightStyle
    }
    /* eslint-enable */
  };

  const unclamp = (selector) => {
    shave(selector, 'auto');

    const els = (typeof selector === 'string') ? document.querySelectorAll(selector) : selector;
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      el.dispatchEvent(new CustomEvent('rb.typography.unclamp'));
    }
  };

  rb.typography.clamp = clamp;
  rb.typography.unclamp = unclamp;
})(window.rb, document, jQuery);
