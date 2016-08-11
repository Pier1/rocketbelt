'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var eyeglass = require('eyeglass');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix   = require('gulp-autoprefixer');
var plumber  = require('gulp-plumber');
var notify   = require('gulp-notify');
var rename   = require('gulp-rename');
var del      = require('del');
var clone    = require('gulp-clone');
var merge    = require('merge-stream');
var size     = require('gulp-size');

var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var flexibility = require('postcss-flexibility');

var jade = require('gulp-jade');
var md = require('jstransformer')(require('jstransformer-markdown-it'));
var shortid = require('shortid');
var _ = require('lodash');

var jadeInheritance = require('gulp-jade-inheritance');
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');

var vfs = require('vinyl-fs');
var exec = require('child_process').exec;
var dist = './dist';
var distCss = dist + '/css';
var slipwayDir = './slipway';
var siteDir = './site';


var nav = [];

gulp.task('default', ['styles', 'views', 'server', 'watch']);

gulp.task('server', function () {
  return browserSync.init({
    server: {
      injectChanges: true,
      baseDir: dist
    }
  });
});

gulp.task('watch', function(){
  global.isWatching = true;

  gulp.watch(['./slipway/**/*.scss', './content/scss/**/*.scss'], ['styles']);
  gulp.watch('./content/**/*', ['views']);
  gulp.watch(dist + '/**/*.html').on('change', debounce(browserSync.reload, 500));
  gulp.watch(dist + '/**/*.js').on('change', debounce(browserSync.reload, 500));
});

var sizeOptions = {
  showFiles: true,
  gzip: true
};

gulp.task('styles:max', function () {
  return gulp.src(['./slipway/**/*.scss', './content/scss/**/*.scss'])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sourcemaps.init())
    .pipe(sass(eyeglass()))
    .pipe(prefix({
      browsers: ['last 5 Chrome versions',
                 'last 5 Firefox versions',
                 'Safari >= 9',
                 'ie >= 9',
                 'Edge >= 1',
                 'iOS >= 8',
                 'Android >= 4.4']
    }))
    .pipe(postcss([flexibility()]))
    .pipe(size(sizeOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distCss))
  ;
});

gulp.task('styles', ['styles:max'], function () {
  return gulp.src([distCss + '/*.css', '!' + distCss + '/*.min.css'])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(changed(distCss, { extension: '.min.css' }))
    .pipe(postcss([cssnano()]))
    .pipe(sourcemaps.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(size(sizeOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distCss))
  ;
});

gulp.task('clean', ['link:clean'], function () {
  del(['**/*/.DS_Store']);
  del([dist]);
});

gulp.task('build', ['clean', 'styles', 'views']);

gulp.task('js:site:copy', function () {
  vfs.src(['./content/**/*.js']).pipe(vfs.dest(dist));
});

gulp.task('link:partials', function () {
  return vfs.src('./slipway/**/_*.jade')
    .pipe(vfs.symlink('./content', { relative: true }));
});

gulp.task('link:js', function () {
  return vfs.src('./slipway/**/*.js', './slipway/**/*.json')
    .pipe(vfs.symlink('./content', { relative: true }));
});

gulp.task('link:clean', function () {
  exec('find ./content -type l -exec test ! -e {} \\; -delete', function (err, stdout, stderr) { })
});

gulp.task('views', ['link:partials', 'link:js', 'js:site:copy'], function () {
  var dir = './content';
  directoryTreeToObj(dir, function (err, res) {
    if (err)
      console.error(err);

    var colorFamilies = require('./content/base/color/_color-families.json');

    gulp.src(['./content/**/*.jade', '!./content/**/_*.jade'])
      .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
      .pipe(changed(dist, { extension: '.html' }))
      .pipe(gulpif(global.isWatching, cached('jade')))
      .pipe(jadeInheritance({ basedir: dir }))
      .pipe(jade({
        basedir: __dirname + '/content',
        pretty: true,
        md: md,
        locals: {
          nav: res,
          colorFamilies: colorFamilies,
          shortid: shortid,
          _: _
        }
      }))
      .pipe(gulp.dest(dist))
    ;
  });
});

var directoryTreeToObj = function(dir, done) {
  var fs = require('fs');
  var path = require('path');
  var results = [];

  fs.readdir(dir, function(err, files) {
    if (err)
      return done(err);

    files = files.filter(function (file) {
      if (fs.lstatSync(dir + '/' + file).isDirectory()) { if (file === 'js' || file === 'scss') return false; }
      return (file.indexOf('_') !== 0) && (file.indexOf('.js') == -1);
    });

    var pending = files.length;

    if (!pending)
      return done(null, { name: path.basename(dir), type: 'folder', children: results });

    files.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          directoryTreeToObj(file, function(err, res) {
            results.push({
              name: path.basename(file),
              type: 'folder',
              children: res
            });
            if (!--pending)
              done(null, results);
          });
        }
        else {
          results.push({
            type: 'file',
            name: path.basename(file)
          });
          if (!--pending)
            done(null, results);
        }
      });
    });
  });
};

function throttle (callback, limit) {
    var wait = false;
    return function () {
        if (!wait) {
            callback.call();
            wait = true;
            setTimeout(function () {
                wait = false;
            }, limit);
        }
    }
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}
