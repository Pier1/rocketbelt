const toTitleCase = require('to-title-case');

exports.toTitleCase = (str) => {
  const title = str
    .toLowerCase()
    .replace(/-/gi, ' ')
    .replace(' and ', ' & ');

  return toTitleCase(title);
};
