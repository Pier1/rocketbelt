'use strict';
(() => {
  module.exports = (gulp, plugins, config) => {
    return () => {
      const supported =
        ['Chrome >= 49',
         'Firefox >= 48',
         'Safari >= 9',
         'ie >= 9',
         'Edge >= 14',
         'iOS >= 9',
         'Android >= 4.4'];

      const source =
        gulp.src([
          `${config.patternsPath}/**/*.scss`,
          `${config.templatesPath}/scss/**/*.scss`,
        ])
        .pipe(plugins.sassVariables({
          '$serif-uri': process.env.WEBFONT_SERIF_URI
        }))
        .pipe(plugins.plumber({
          errorHandler: plugins.notify.onError('Error: <%= error.message %>')
        }))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.postcss([
          require('postcss-svg')({
            dirs: `${config.patternsPath}/components/icons`,
            svgo: {
              plugins: [{
                removeDesc: true,
                removeTitle: true,
                cleanupAttrs: true
              }]
            }
          })
        ]))
        .pipe(plugins.autoprefixer({
          browsers: supported
        }))
      ;

      const max = source.pipe(plugins.clone())
        .pipe(plugins.sourcemaps.write('.', { sourceRoot: null }))
        .pipe(gulp.dest(config.buildCssPath))
      ;

      const min = source.pipe(plugins.clone())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.rename({ suffix: '.min' }))
        .pipe(plugins.postcss([plugins.cssnano({ autoprefixer: { browsers: supported } })]))
        .pipe(plugins.size(config.sizeOptions))
        .pipe(plugins.sourcemaps.write('.', { sourceRoot: null }))
        .pipe(gulp.dest(config.buildCssPath))
        .pipe(plugins.browserSync.stream({ match: '**/*.css' }))
      ;

      return plugins.mergeStream(max, min);
    };
  };
})();
