'use strict';
const gulp = require('gulp');

const plugins = require('gulp-load-plugins')({ DEBUG: false, pattern: '*' });

const buildPath = './dist';
const buildCssPath = `${buildPath}/css`;
const patternsPath = './rocketbelt';
const templatesPath = './templates';
const tasksPath = './gulp-tasks';

const config = {
  buildPath: buildPath,
  buildCssPath: buildCssPath,
  colorFamilies: require(`${templatesPath}/base/color/_color-families.json`),
  patternsPath: patternsPath,
  templatesPath: templatesPath,
  sizeOptions: {
    showFiles: true,
    gzip: true
  }
};

function getTask(task, taskParams) {
  return require(`${tasksPath}/${task}`)(gulp, plugins, config, taskParams);
}

gulp.task('default', getTask('default'));

gulp.task('a11y', getTask('a11y'));
gulp.task('build', getTask('build'));
gulp.task('clean-links', getTask('clean-links'));
gulp.task('clean', ['clean-links'], getTask('clean'));
gulp.task('copy-js', getTask('copy-js'));
gulp.task('copy-resources', getTask('copy-resources'));
gulp.task('copy-tools', getTask('copy-tools'));
gulp.task('css-sort', getTask('css-sort'));
gulp.task('feature-detection', getTask('feature-detection'));
gulp.task('icons-enterprise', getTask('icons', { enterprise: true }));
gulp.task('icons-ecom', getTask('icons'));
gulp.task('icons', ['icons-ecom', 'icons-enterprise']);
gulp.task('link-svg', getTask('link-svg'));
gulp.task('link-templates', getTask('link-templates'));
gulp.task('link-js', getTask('link-js'));
gulp.task('link', ['link-templates', 'link-js', 'link-svg']);
gulp.task('lint-sass', ['css-sort'], getTask('lint-sass'));
gulp.task('server', getTask('server'));
gulp.task('sitemap', getTask('sitemap'));
gulp.task('styles', getTask('styles'));
gulp.task('test-webserver', getTask('test-webserver'));
gulp.task('test-visual', ['test-webserver'], getTask('test-visual'));
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
