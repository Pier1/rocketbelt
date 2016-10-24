'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
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
var uglify  = require('gulp-uglify');

var jade = require('gulp-jade');
var md = require('jstransformer')(require('jstransformer-markdown-it'));
var shorthash = require('shorthash');
var _ = require('lodash');

var affected = require('gulp-jade-find-affected');
var jadeInheritance = require('gulp-jade-inheritance');
var changed = require('gulp-changed');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');

var vfs = require('vinyl-fs');
var symlink = require('gulp-symlink');
var path = require('path');
var exec = require('child_process').exec;

var argv = require('minimist')(process.argv.slice(2));
// var buildPath = './docs';
var buildPath = './dist';
var buildCss = buildPath + '/css';
var rbDir = './rocketbelt';
var siteDir = './site';

var nav = [];

gulp.task('default', function (done) {
  runSequence('build', ['server', 'watch'], done);
});

gulp.task('server', function () {
  return browserSync.init({
    server: {
      injectChanges: true,
      baseDir: buildPath
    }
  });
});

gulp.task('watch', function(){
  global.isWatching = true;

  gulp.watch(['./rocketbelt/**/*.scss', './templates/scss/**/*.scss'], ['styles']);
  gulp.watch('./templates/**/*', ['views']);
  gulp.watch(['./rocketbelt/**/*.js'], ['uglify']);
  gulp.watch(buildPath + '/**/*.html').on('change', debounce(browserSync.reload, 500));
  gulp.watch(buildPath + '/**/*.js').on('change', debounce(browserSync.reload, 500));
});

var sizeOptions = {
  showFiles: true,
  gzip: true
};

gulp.task('uglify', function () {
  return gulp.src(['./rocketbelt/**/*.js', '!./rocketbelt/**/*.min.js'])
    .pipe(changed(buildPath))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(size(sizeOptions))
    .pipe(sourcemaps.write('.', { sourceRoot: '.' }))
    .pipe(gulp.dest(buildPath))
  ;
});

gulp.task('styles', function () {
  var source = gulp.src(['./rocketbelt/**/*.scss', './templates/scss/**/*.scss'])
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
  ;

  var max = source.pipe(clone())
    .pipe(sourcemaps.write('.', { sourceRoot: null }))
    .pipe(gulp.dest(buildCss))
  ;

  var min = source.pipe(clone())
    .pipe(sourcemaps.init())
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([cssnano()]))
    .pipe(size(sizeOptions))
    .pipe(sourcemaps.write('.', { sourceRoot: null }))
    .pipe(gulp.dest(buildCss))
    .pipe(browserSync.stream({ match: '**/*.css' }))
  ;

  return merge(max, min);
});

gulp.task('clean', ['link:clean'], function () {
  del(['**/*/.DS_Store']);
  del([buildPath]);
});

gulp.task('build', function (done) {
  if (!argv.release) {
    runSequence('uglify', 'link', ['styles', 'views'], done);
  }
  else {
    runSequence('uglify', 'link', ['styles', 'views'], 'del-assets', done);
  }
});

gulp.task('del-assets', function () {
  if (argv.release) {
    del(['rocketbelt/', 'templates/', 'docs/']);
  }
});

gulp.task('js:site:copy', function () {
  vfs.src(['./templates/**/*.js'])
    .pipe(changed(buildPath))
    .pipe(vfs.dest(buildPath, { overwrite: true }));
});

gulp.task('img:site:copy', function () {
  vfs.src(['./templates/**/img/*.*'])
    .pipe(changed(buildPath))
    .pipe(vfs.dest(buildPath, { overwrite: true }));
});

gulp.task('link', ['link:partials', 'link:js']);

gulp.task('link:partials', function () {
  return gulp.src('./rocketbelt/**/_*.jade')
    .pipe(symlink(function (file) {
      return path.join('./templates', file.relative);
    }, { force: true, log: false }));
  // TODO: Using gulp-symlink because relative symlinks are broken in vfs.
  // Should be fixed in vfs 3.0 and the above should be replaced with the following:
  // return vfs.src('./rocketbelt/**/_*.jade')
  //   .pipe(vfs.symlink('./templates', { relative: true }));
});

gulp.task('link:js', function () {
  return gulp.src(['./rocketbelt/**/*.js', './rocketbelt/**/*.json', '!./**/slipsum-cache.json'])
    .pipe(symlink(function (file) {
      return path.join('./templates', file.relative);
    }, { force: true, log: false }));
  // TODO: Using gulp-symlink because relative symlinks are broken in vfs.
  // Should be fixed in vfs 3.0 and the above should be replaced with the following:
  // return vfs.src('./rocketbelt/**/*.js', './rocketbelt/**/*.json')
  //   .pipe(vfs.symlink('./templates', { relative: true }));
});

gulp.task('link:clean', function () {
  exec('find ./templates -type l -delete', function (err, stdout, stderr) { });
});

gulp.task('views', ['js:site:copy', 'img:site:copy'], function () {
  var dir = './templates';
  directoryTreeToObj(dir, function (err, res) {
    if (err)
      console.error(err);

    var colorFamilies = require('./templates/base/color/_color-families.json');

    return gulp.src(['./templates/**/*.jade', '!./templates/**/_*.jade'])
      .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
      .pipe(affected())
      .pipe(jadeInheritance({ basedir: dir }))
      .pipe(jade({
        basedir: __dirname + '/templates',
        pretty: true,
        md: md,
        locals: {
          buildPath: argv.release ? '' : '',
          nav: res,
          colorFamilies: colorFamilies,
          shorthash: shorthash,
          _: _
        }
      }))
      .pipe(gulp.dest(buildPath))
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
      if (fs.lstatSync(dir + '/' + file).isDirectory()) { 
        if (file === 'js' || file === 'scss') return false; 
      }
      return (file.indexOf('_') !== 0) && (file.indexOf('.js') == -1);
    });

    var pending = files.length;

    if (!pending)
      return done(null, { name: path.basename(dir), type: 'folder', children: results });

    files.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if ( true /* file.indexOf('/img') === -1  */) {
          if (stat && stat.isDirectory() ) {
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
