exports.addScript = (src, appendToElement) => {
  if (typeof document !== 'undefined') {
    const matchingScripts = document.querySelectorAll(`script[src*='${src}?'`);

    matchingScripts.forEach((s) => {
      s.remove();
    });

    const s = document.createElement('script');
    s.setAttribute('src', `${src}?${Date.now()}`);

    if (appendToElement) {
      if (typeof appendToElement === 'string') {
        document.querySelector(appendToElement).appendChild(s);
      } else if (typeof appendToElement === 'object') {
        appendToElement.appendChild(s);
      }
    } else {
      document.body.appendChild(s);
    }
  }
};
