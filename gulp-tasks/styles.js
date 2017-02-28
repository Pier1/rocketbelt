(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      var supported =
        ['last 10 Chrome versions',
         'last 10 Firefox versions',
         'Safari >= 9',
         'ie >= 9',
         'Edge >= 1',
         'iOS >= 8',
         'Android >= 4.4'];

      var source = gulp.src([config.patternsPath + '/**/*.scss', config.templatesPath + '/scss/**/*.scss'])
        .pipe(plugins.plumber({ errorHandler: plugins.notify.onError('Error: <%= error.message %>') }))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer({
          browsers: supported
        }))
        .pipe(plugins.postcss([plugins.postcssFlexibility()]))
      ;

      var max = source.pipe(plugins.clone())
        .pipe(plugins.sourcemaps.write('.', { sourceRoot: null }))
        .pipe(gulp.dest(config.buildCssPath))
      ;

      var min = source.pipe(plugins.clone())
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
