'use strict';
(() => {
  var directoryTreeToObj = (dir, done) => {
    var fs = require('fs');
    var path = require('path');
    var results = [];

    fs.readdir(dir, (err, files) => {
      if (err) {
        return done(err);
      }

      files = files.filter((file) => {
        if (fs.lstatSync(dir + '/' + file).isDirectory()) {
          if (file === 'js' || file === 'scss' || file === 'assets' || file === 'partials') return false;
        }

        return (file.indexOf('_') !== 0) &&
               (file.indexOf('.js') === -1) &&
               (file.indexOf('.ttf') === -1) &&
               (file.indexOf('.DS_Store') === -1);
      });

      var pending = files.length;

      if (!pending) {
        return done(null, { name: path.basename(dir), type: 'folder', children: results });
      }

      files.forEach((file) => {
        file = path.resolve(dir, file);
        fs.stat(file, (err, stat) => {
          if ( true /* file.indexOf('/img') === -1  */) {
            if (stat && stat.isDirectory() ) {
              directoryTreeToObj(file, (err, res) => {
                results.push({
                  name: path.basename(file),
                  type: 'folder',
                  children: res
                });
                if (!--pending) {
                  done(null, results);
                }
              });
            } else {
              results.push({
                type: 'file',
                name: path.basename(file)
              });
              if (!--pending) {
                done(null, results);
              }
            }
          }
        });
      });
    });
  };

  module.exports = (gulp, plugins, config) => {
    return () => {
      var fs = require('fs');
      var icons = fs.readdirSync(config.patternsPath + '/components/icons/svg');

      return directoryTreeToObj(config.templatesPath, (err, res) => {
        if (err) {
          console.error(err);
        }

        return gulp.src([config.templatesPath + '/**/*.pug', '!' + config.templatesPath + '/**/_*.pug'])
          .pipe(plugins.plumber({ errorHandler: plugins.notify.onError('Error: <%= error.message %>') }))
          .pipe(plugins.jadeFindAffected())
          .pipe(plugins.jadeInheritance({ basedir: config.templatesPath }))
          .pipe(plugins.pug({
            basedir: __dirname + '/../' + config.templatesPath,
            pretty: true,
            locals: {
              buildPath: '',
              nav: res,
              icons: icons,
              colorFamilies: config.colorFamilies,
              shorthash: plugins.shorthash,
              _: plugins.lodash
            }
          }))
          .pipe(gulp.dest(config.buildPath))
        ;
      });
    };
  };
})();
