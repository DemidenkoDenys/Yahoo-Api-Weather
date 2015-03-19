/*
 1. Check the version node.js ( 0.10.25) and npm ( 2.3.0)

 node -v
 npm -v

 If the version does not match, update

 sudo npm cache clean -f
 sudo npm install -g n
 sudo n stable

 2. install modules
 sudo npm install

 4. Run gulp
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
var imageMin = require('gulp-imagemin');
var pngCrush = require('imagemin-pngcrush');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cmq = require('gulp-combine-media-queries');
var cssMin = require('gulp-cssmin');
var csscomb = require('gulp-csscomb');
var rigger = require('gulp-rigger');

var pages_ = require('./pages.json');

//HTML include

var pages = pages_.map(function (a) {
    return '_' + a + '.html';
});
var pagesAdd = pages;
pagesAdd.push('templates/*.html');

gulp.task('htmlimport', function () {
    gulp.src(pages)
        .pipe(rigger())
        .pipe(rename(function (path) {
            var newName = path.basename;
            if (newName.charAt(0) === '_')
                newName = newName.slice(1);
            path.basename = newName;
        }))
        .pipe(gulp.dest(''));
});

// Images, Fonts

gulp.task('imgmin', function () {
    return gulp.src('assets/images/**')
        .pipe(imageMin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false}
            ],
            use: [pngCrush()]
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
        .pipe(prefix('last 2 versions', '> 1%', 'ie 9'))
        .pipe(cmq({
            log: true
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(csscomb())
        .pipe(cssMin())
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
    gulp.watch(pagesAdd, ['htmlimport']);
    gulp.watch('assets/css/**/*.scss', ['scss']);
});

// DEFAULT

gulp.task('default', ['imgmin', 'fonts', 'scss', 'js', 'watch']);
