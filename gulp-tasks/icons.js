'use strict';
(() => {
  module.exports = (gulp, plugins, config, taskParams) => {
    return () => {
      const util = require('util');
      const exec = util.promisify(require('child_process').exec);

      const sketchtool = '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';
      const rocketbeltSketchfile = process.env.ROCKETBELT_SKETCHFILE;
      const iconsPageName = 'Icons';

      const getSketchfileMetadata = async () => {
        const { stdout, stderr } = 
          await exec(`${sketchtool} metadata "${rocketbeltSketchfile}"`);

        return JSON.parse(stdout);
      }

      getSketchfileMetadata()
      .then(metadata => {
        return Object.entries(metadata.pagesAndArtboards).map(([key, page]) => {
          if (page.name === iconsPageName) {
            return Object.keys(page.artboards);
          }
        }).filter(item => { return item !== undefined }).pop();
      })
      .then(keys => {
        let spriteName = 'rocketbelt.icons.svg';

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

        const iconsPath = `${config.patternsPath}/components/icons/svg`;

        gulp.src(rocketbeltSketchfile)
          .pipe(plugins.sketch({
            export: 'artboards',
            items: keys.join(),
            formats: 'svg'
          }))
          .pipe(plugins.removeHtmlComments())
          .pipe(plugins.rename(path => {
            path.dirname = './'
          }))
          .pipe(gulp.dest(iconsPath));

        const iconsForSprite = `${iconsPath}/*.svg`;
        console.log(iconsPath);
        return gulp.src(iconsForSprite)
          .pipe(plugins.svgSprite(options))
          .pipe(plugins.cheerio({
            xmlMode: true,
            recognizeSelfClosing: true,
            run: ($) => {
              $('symbol[id^=rb-icon-]').each(function elHandler() {
                const $symbol = $(this);
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
          .pipe(gulp.dest(`${iconsPath}`))
        ;
      });
    };
  };
})();
