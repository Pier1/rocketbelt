exports.addScript = (src) => {
  const s = document.createElement('script');
  s.setAttribute('src', `${src}?${Date.now()}`);
  document.body.appendChild(s);
};
