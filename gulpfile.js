'use strict';
const gulp = require('gulp');

const plugins = require('gulp-load-plugins')({ DEBUG: false, pattern: '*' });

const buildPath = './public';
const buildCssPath = `${buildPath}/css`;
const patternsPath = './src/rocketbelt';
const templatesPath = './src/templates';
const tasksPath = './gulp-tasks';

const config = {
  buildPath: buildPath,
  buildCssPath: buildCssPath,
  patternsPath: patternsPath,
  templatesPath: templatesPath,
  sizeOptions: {
    showFiles: true,
    gzip: true,
  },
};

function getTask(task, taskParams) {
  return require(`${tasksPath}/${task}`)(gulp, plugins, config, taskParams);
}

gulp.task('default', getTask('default'));

gulp.task('build', getTask('build'));
gulp.task('clean-links', getTask('clean-links'));
gulp.task('clean', ['clean-links'], getTask('clean'));
gulp.task('copy-js', getTask('copy-js'));
gulp.task('copy-resources', getTask('copy-resources'));
gulp.task('copy-tools', getTask('copy-tools'));
gulp.task('css-sort', getTask('css-sort'));
gulp.task('icons', getTask('icons'));
gulp.task('link-svg', getTask('link-svg'));
gulp.task('link-templates', getTask('link-templates'));
gulp.task('link-js', getTask('link-js'));
gulp.task('link', ['link-templates', 'link-js', 'link-svg']);
gulp.task('lint-sass', ['css-sort'], getTask('lint-sass'));
gulp.task('server', getTask('server'));
gulp.task('styles', getTask('styles'));
gulp.task('uglify', getTask('uglify'));
gulp.task('views', ['copy-js', 'copy-resources'], getTask('views'));
gulp.task('watch', getTask('watch'));

function throttle(callback, limit) {
  let wait = false;
  return () => {
    if (!wait) {
      callback.call();
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
    }
  };
}
