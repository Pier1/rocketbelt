'use strict';
((rb, document, $) => {
  rb.typography = rb.typography || {};

  const truncate = (target, numLines, opts) => {
    const lineHeight =
      getComputedStyle(document.querySelector('.truncatable')).lineHeight.replace('px', '');
    const maxHeight = numLines * lineHeight;

    shave(target, maxHeight, opts);
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
    const classname = opts.classname || 'truncatable_truncated-text'
    const charClassname = 'truncatable_truncation-placeholder'
    const truncationMarkup = opts.truncationMarkup
    const spaces = typeof opts.spaces === 'boolean' ? opts.spaces : true
    const charHtml =
      truncationMarkup ?
        `<span class="${charClassname}">… ${truncationMarkup}</span>` :
        `<span class="${charClassname}">${character}</span>`

    if (!('length' in els)) els = [els]
    for (let i = 0; i < els.length; i += 1) {
      const el = els[i]
      el.classList.add('truncatable-truncated');

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

  const untruncate = (selector) => {
    shave(selector, 'auto');

    const els = document.querySelectorAll(selector);
    els.forEach((el) => {
      el.dispatchEvent(new CustomEvent('rb.typography.untruncated'));
    });
  };

  rb.typography.truncate = truncate;
  rb.typography.untruncate = untruncate;
})(window.rb, document, jQuery);
