export const advanceIndicator = (e) => {
  const current = e.target.nextElementSibling.querySelector(
    '.progress-stepped li[aria-current]'
  );
  const next =
    current.nextElementSibling !== null
      ? current.nextElementSibling
      : e.target.nextElementSibling.querySelector(
          '.progress-stepped li:first-of-type'
        );
  current.removeAttribute('aria-current');
  next.setAttribute('aria-current', 'page');
};
