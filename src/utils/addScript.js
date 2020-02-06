exports.addScript = (src) => {
  if (typeof document !== 'undefined') {
    const matchingScripts = document.querySelectorAll(`script[src*='${src}?'`);

    matchingScripts.forEach((s) => {
      s.remove();
    });

    const s = document.createElement('script');
    s.setAttribute('src', `${src}?${Date.now()}`);
    document.body.appendChild(s);
  }
};
