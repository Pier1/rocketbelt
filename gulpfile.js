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

var dist = './dist';
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

  gulp.watch('./scss/**/*.scss', ['styles']);
  gulp.watch('./content/**/*', ['views']);
  gulp.watch(dist + '/**/*.html').on('change', debounce(browserSync.reload, 500));
  gulp.watch(dist + '/**/*.js').on('change', debounce(browserSync.reload, 500));
});

gulp.task('styles', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sourcemaps.init())
    .pipe(sass(eyeglass()))
    .pipe(prefix({
      browsers: ['last 5 Chrome versions',
                 'last 5 Firefox versions',
                 'Safari >= 6',
                 'ie >= 9',
                 'Edge >= 1',
                 'iOS >= 8',
                 'Android >= 4.3']
    }))
    .pipe(postcss([flexibility()]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist + '/css'))
    .pipe(postcss([cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist + '/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
  ;
});

gulp.task('clean', function () {
  del(['**/*/.DS_Store']);
  del([dist + '/**/*']);
});

gulp.task('build', ['clean', 'styles', 'views'], function () {

});

gulp.task('copy-js', function () {
  del([dist + '/**/*.js']);
  gulp.src(['./content/**/*.js']).pipe(gulp.dest(dist));
});

gulp.task('views', ['copy-js'], function () {
  var dir = './content';
  directoryTreeToObj(dir, function (err, res) {
    if (err)
      console.error(err);

    var colorFamilies = require('./content/design/color/_color-families.json');

    gulp.src(['./content/**/*.jade', '!./content/**/_*.jade'])
      .pipe(changed(dist, { extension: '.html' }))
      .pipe(gulpif(global.isWatching, cached('jade')))
      .pipe(jadeInheritance({ basedir: dir }))
      .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
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
      return file.indexOf('_') !== 0;
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
