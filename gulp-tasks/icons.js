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

      const options = {
        shape: {
          id: {
            generator: (file) => {
              return `rb-icon-${file.replace(/\.svg/, '')}`;
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
            sprite: `../../${spriteName}`,
            prefix: '.'
          }
        }
      };

      const iconsPath = `${config.patternsPath}/components/icons`;
      const sketchFiles = enterprise ? '/**/*.sketch' : '/**/rocketbelt.icons.sketch';

      return gulp.src(iconsPath + sketchFiles)
        .pipe(plugins.sketch({
          export: 'artboards',
          formats: 'svg'
        }))
        .pipe(plugins.removeHtmlComments())
        .pipe(gulp.dest(`${iconsPath}/svg`))
        .pipe(plugins.svgSprite(options))
        .pipe(plugins.cheerio({
          xmlMode: true,
          recognizeSelfClosing: true,
          // lowerCaseAttributeNames: false,
          run: ($) => {
            $('symbol[id^=rb-icon-]').each(function elHandler() {
              const $symbol = $(this);
              // const grayMinus2 = '#4a4647';
              $symbol.css('fill', 'var(--color, inherit)');

              // The following lines are necessary because cheerio lowercases attribute names,
              // despite the value of the `lowerCaseAttributeNames` option above…
              // and `viewBox` is case-sensitive. 😿
              $symbol.attr('viewBox', $symbol.attr('viewbox'));
              $symbol.removeAttr('viewbox');
            });
          }
        }))
        .pipe(plugins.htmltidy(
          {
            inputXml: true,
            outputXml: true,
            indent: true,
            indentSpaces: 2,
            wrapAttributes: false
          }
        ))
        .pipe(gulp.dest(`${iconsPath}/svg`))
      ;
    };
  };
})();
