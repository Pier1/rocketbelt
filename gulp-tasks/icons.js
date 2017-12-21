'use strict';
(() => {
  module.exports = (gulp, plugins, config, taskParams) => {
    return () => {
      let spriteName = 'rocketbelt.icons';
      let enterprise = false;

      if (taskParams && taskParams.enterprise === true) {
        spriteName += '.enterprise.svg';
        enterprise = true;
      } else {
        spriteName += '.svg';
      }

      let options = {
        shape: {
          id: {
            generator: (file) => {
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

      const iconsPath = config.patternsPath + '/components/icons';
      const sketchFiles = enterprise ? '/**/*.sketch' : '/**/rocketbelt.icons.sketch';

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
