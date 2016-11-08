(function () {
  'use strict';

  module.exports = function (gulp, plugins, config) {
    return function () {
      var options = {
        shape: {
          id: {
            generator: function (file) {
              return 'rb-icon-' + file.replace(/\.svg/, '');
            }
          },
          transform: [{
            svgo: {
              plugins: [
                { removeUnusedNS: true },
                { removeAttrs: { attrs: '(stroke|fill)' } }
              ]
            }
          }],
          dimension: {
            maxWidth: 32,
            maxHeight: 32
          },
          spacing: {
            padding: 10
          },
                  },
        mode: {
          symbol: {
            dest: './sprite',
            sprite: 'rocketbelt.icons.symbols.svg',
            prefix: '.'
          },
        }
      };

      return gulp.src(config.patternsPath + '/components/icons/**/*.sketch')
        .pipe(plugins.sketch({
          export: 'artboards',
          formats: 'svg'
        }))
        .pipe(gulp.dest(config.patternsPath + '/components/icons/svg'))
        .pipe(plugins.svgSprite(options))
        .pipe(plugins.htmltidy(
          {
            inputXml: true,
            outputXml: true,
            indent: true,
            indentSpaces: 2,
            wrapAttributes: false
          }
        ))
        .pipe(gulp.dest(config.patternsPath + '/components/icons/svg'))
      ;
    };
  };
})();
