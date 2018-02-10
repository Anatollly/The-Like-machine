'use strict';

const gulp = require('gulp');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const webpack = require('gulp-webpack');
const del = require('del');
const babel = require('gulp-babel');

gulp.task('content_scripts', function () {
  return gulp.src('./content_scripts/content.js')
    .pipe(plumber())
    .pipe(webpack({
      devtool: 'source-map',
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader' }
        ]
      },
      output: {
          filename: "content.js"
      }
    }))
    .pipe(gulp.dest('build/content_scripts/'));
});

gulp.task('background_scripts', function () {
  return gulp.src('./background/background.js')
    .pipe(plumber())
    .pipe(webpack({
      devtool: 'source-map',
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader' }
        ]
      },
      output: {
          filename: "background.js"
      }
    }))
    .pipe(gulp.dest('build/background/'));
});

gulp.task('popup_scripts', function () {
  return gulp.src('./popup/popup.js')
    .pipe(plumber())
    .pipe(webpack({
      devtool: 'source-map',
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader' }
        ]
      },
      output: {
          filename: "popup.js"
      }
    }))
    .pipe(gulp.dest('build/popup/'));
});

gulp.task('clean', function() {
  return del(['build/*']);
});

gulp.task('html', function() {
  return gulp.src('popup/popup.html', {since: gulp.lastRun('html')})
    .pipe(newer('build/popup/'))
    .pipe(gulp.dest('build/popup/'));
});

gulp.task('images', function() {
  return gulp.src('images/**/*.*', {since: gulp.lastRun('images')})
    .pipe(newer('build/images/'))
    .pipe(gulp.dest('build/images/'));
});

gulp.task('manifest', function() {
  return gulp.src('manifest.json', {since: gulp.lastRun('manifest')})
    .pipe(gulp.dest('build/'));
});

gulp.task('watch', function() {
  gulp.watch('content_scripts/**/*.*', gulp.series('content_scripts'));
  gulp.watch('background/**/*.*', gulp.series('background_scripts'));
  gulp.watch('popup/*.js', gulp.series('popup_scripts'));
  gulp.watch('popup/*.html', gulp.series('html'));
  gulp.watch('images/**/*.*', gulp.series('images'));
});

gulp.task('build',
  gulp.series('clean',
    gulp.parallel('content_scripts', 'background_scripts', 'popup_scripts', 'html', 'images', 'manifest'),
    'watch')
);
