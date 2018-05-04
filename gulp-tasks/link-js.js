'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      return plugins.vinylFs.src([`${config.patternsPath}/**/*.js`,
                                  `${config.patternsPath}/**/*.json`,
                                  `!${config.patternsPath}/**/rocketbelt.slipsum-cache.json`,
                                  `!${config.patternsPath}/tools/**/*`])
        .pipe(plugins.plumber({
          errorHandler: plugins.notify.onError('Error: <%= error.message %>')
        }))
        .pipe(plugins.vinylFs.symlink(config.templatesPath, { relative: true }));
    };
  };
})();
