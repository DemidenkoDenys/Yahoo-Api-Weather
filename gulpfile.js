/*
 1. Проверяем версию node.js (должна быть 0.10.25) и npm (должна быть 2.3.0)
 node -v
 npm -v
 Если версия не совпадает, обновляем таким образом:
 sudo npm cache clean -f
 sudo npm install -g n
 sudo n stable

 2. Устанавливаем gulp
 sudo npm install --global gulp
 sudo npm install --save-dev gulp

 3. Устанавливаем нужные модули

 sudo npm install gulp gulp-rename
 sudo npm install gulp-jscs gulp-jshint jshint-stylish gulp-concat gulp-uglify
 sudo npm install gulp-sass gulp-autoprefixer gulp-cssmin
 sudo npm install gulp-imagemin imagemin-pngcrush

 gulp
 */

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var prefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

// IMAGES, FONTS

gulp.task('imgmin', function () {
  return gulp.src('assets/images/**')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [
        {removeViewBox: false}
      ],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  gulp.src('assets/fonts/**')
    .pipe(gulp.dest('dist/fonts'));
});

// SCSS

gulp.task('scss', function () {
  gulp.src(['assets/css/global.scss', 'assets/css/pages/*.scss'])
    .pipe(sass())
    .pipe(prefix('last 2 versions', '> 1%', 'ie 7', 'ie 8', 'ie 9'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cssmin())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css'));
});

// JS

function getFiles(dir) {
  return fs.readdirSync(dir)
    .filter(function (file) {
      return fs.statSync(path.join(dir, file)).isFile();
    });
}

function mapJs(callback) {
  if (typeof callback !== 'function') {
    return;
  }
  getFiles('assets/js')
    .forEach(function (file) {
      file = file.slice(0, -3);
      callback(file);
    });
}

gulp.task('jscs', function () {
  mapJs(function (file) {
    gulp.src(['assets/js/' + file + '.js'])
      .pipe(jscs());
  });
});

gulp.task('lint', function () {
  mapJs(function (file) {
    gulp.src(['assets/js/' + file + '.js'])
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'));
  });
});

gulp.task('js', ['jscs', 'lint'], function () {
  mapJs(function (file) {
    gulp.src(['assets/js/' + file + '/**', 'assets/js/' + file + '.js'])
      .pipe(concat(file + '.js'))
      .pipe(gulp.dest('dist/js'))
      .pipe(uglify())
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest('dist/js'));
  });
});

// WATCH

gulp.task('watch', function () {
  gulp.watch('assets/js/**/*.js', ['js']);
  gulp.watch('assets/css/**/*.scss', ['scss']);
});

// DEFAULT

gulp.task('default', ['imgmin', 'fonts', 'scss', 'js', 'watch']);
