(function () {
  'use strict';

  module.exports = function (gulp, plugins, config, taskParams) {
    return function () {
      var spriteName = 'rocketbelt.icons';
      var enterprise = false;

      if (taskParams && taskParams.enterprise === true) {
        spriteName += '.enterprise.svg';
        enterprise = true;
      } else {
        spriteName += '.svg';
      }

      var options = {
        shape: {
          id: {
            generator: function (file) {
              return 'rb-icon-' + file.replace(/\.svg/, '');
            }
          },
          meta: './rocketbelt/components/icons/rocketbelt.icons.meta.yaml',
          transform: [{
            svgo: {
              plugins: [
                { removeViewBox: true },
                { removeUnusedNS: true },
                { removeAttrs: { attrs: '(stroke|fill)' } }
              ]
            }
          }]
        },
        mode: {
          inline: true,
          symbol: {
            dest: './sprite',
            sprite: '../../' + spriteName,
            prefix: '.'
          }
        }
      };

      var iconsPath = config.patternsPath + '/components/icons';
      var sketchFiles = enterprise ? '/**/*.sketch' : '/**/rocketbelt.icons.sketch';

      return gulp.src(iconsPath + sketchFiles)
        .pipe(plugins.sketch({
          export: 'artboards',
          formats: 'svg'
        }))
        .pipe(plugins.removeHtmlComments())
        .pipe(gulp.dest(iconsPath + '/svg'))
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
        .pipe(gulp.dest(iconsPath + '/svg'))
      ;
    };
  };
})();
