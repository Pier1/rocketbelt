'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    const packageJson = require('../package.json');
    return () => {
      const supported = [
        'Chrome >= 49',
        'Firefox >= 48',
        'Safari >= 9',
        'ie >= 11',
        'Edge >= 14',
        'iOS >= 9',
        'Android >= 5.1.1',
      ];

      const source = gulp
        .src([
          `${config.patternsPath}/**/*.scss`,
          `${config.templatesPath}/scss/**/*.scss`,
        ])
        .pipe(
          plugins.plumber({
            errorHandler: plugins.notify.onError('Error: <%= error.message %>'),
          })
        )
        .pipe(plugins.sourcemaps.init())
        .pipe(
          plugins.sassVariables({
            '$rb-version': packageJson.version,
          })
        )
        .pipe(plugins.sass())
        .pipe(
          plugins.postcss([
            require('postcss-svg')({
              dirs: `${config.patternsPath}/components/icons`,
              svgo: {
                plugins: [
                  {
                    removeDesc: true,
                    removeTitle: true,
                    cleanupAttrs: true,
                  },
                ],
              },
            }),
          ])
        )
        .pipe(
          plugins.autoprefixer({
            browsers: supported,
          })
        )
        .pipe(plugins.cssbeautify());
      const max = source
        .pipe(plugins.clone())
        .pipe(plugins.sourcemaps.write('.', { sourceRoot: null }))
        .pipe(gulp.dest(config.buildCssPath));
      const min = source
        .pipe(plugins.clone())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(
          plugins.postcss([
            plugins.cssnano({
              svgo: false,
              autoprefixer: { browsers: supported },
              normalizeUrl: {
                stripWWW: false,
              },
            }),
          ])
        )
        .pipe(plugins.size(config.sizeOptions))
        .pipe(plugins.sourcemaps.write('.', { sourceRoot: null }))
        .pipe(gulp.dest(config.buildCssPath))
        .pipe(plugins.browserSync.stream({ match: '**/*.css' }));
      return plugins.mergeStream(max, min);
    };
  };
})();
