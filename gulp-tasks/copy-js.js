'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      plugins.vinylFs.src(['node_modules/hoverintent/dist/hoverintent.min.js'])
        .pipe(plugins.rename('rocketbelt.hoverintent.js'))
        .pipe(plugins.vinylFs.dest(`${config.patternsPath}/base/vendor/`));

      // Polyfill for MutationObserver in old versions of IE.
      // See https://github.com/megawac/MutationObserver.js.
      plugins.vinylFs.src(['node_modules/mutationobserver-shim/dist/mutationobserver.min.js'])
        .pipe(plugins.rename('rocketbelt.mutationobserver.js'))
        .pipe(plugins.vinylFs.dest(`${config.patternsPath}/base/vendor/`));

      // plugins.vinylFs.src(['node_modules/siema/dist/siema.min.js'])
      //   .pipe(plugins.rename('rocketbelt.siema.min.js'))
      //   .pipe(plugins.vinylFs.dest(`${config.patternsPath}/components/vendor/`));

      return plugins.vinylFs.src([`${config.templatesPath}/**/*.js`])
        .pipe(plugins.changed(config.buildPath))
        .pipe(plugins.vinylFs.dest(config.buildPath, { overwrite: true }));
    };
  };
})();
