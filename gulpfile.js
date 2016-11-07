'use strict';
var gulp = require('gulp');
var nav = [];

var plugins = require('gulp-load-plugins')({ DEBUG: false, pattern: '*' });

var buildPath = './dist';
var buildCssPath = buildPath + '/css';
var patternsPath = './rocketbelt';
var templatesPath = './templates';
var tasksPath = './gulp-tasks';
var utilsPath = tasksPath + '/utils';

var config = {
  buildPath: buildPath,
  buildCssPath: buildCssPath,
	colorFamilies: require(templatesPath + '/base/color/_color-families.json'),
  patternsPath: patternsPath,
	templatesPath: templatesPath,
  sizeOptions: {
    showFiles: true,
    gzip: true
  }
};

var utils = {
	getTask: require(utilsPath + '/getTask')
};

function getTask(task) {
  return require('./gulp-tasks/' + task)(gulp, plugins, config);
}

gulp.task('default', getTask('default'));

gulp.task('server', getTask('server'));
gulp.task('watch',  getTask('watch'));
gulp.task('uglify', getTask('uglify'));
gulp.task('feature-detection', getTask('feature-detection'));
gulp.task('styles', getTask('styles'));
gulp.task('clean-links', getTask('clean-links'));
gulp.task('clean', ['clean-links'], getTask('clean'));
gulp.task('link-templates', getTask('link-templates'));
gulp.task('link-js', getTask('link-js'));
gulp.task('link', ['link-templates', 'link-js']);
gulp.task('copy-js', getTask('copy-js'));
gulp.task('copy-img', getTask('copy-img'));
gulp.task('views', ['copy-js', 'copy-img'], getTask('views'));
gulp.task('sitemap', getTask('sitemap'));
gulp.task('lint-sass', getTask('lint-sass'));
gulp.task('build', getTask('build'));
gulp.task('a11y', getTask('a11y'));

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
  };
}
