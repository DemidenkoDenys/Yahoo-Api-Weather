/*

 1. Install gulp globally:

sudo npm install --global gulp

 2. Install gulp in your project devDependencies:

sudo npm install --save-dev gulp
sudo npm install gulp-sass gulp-jshint gulp-concat gulp-rename gulp-uglify gulp-autoprefixer gulp-cssmin gulp-imagemin imagemin-pngcrush

 3. Run gulp:

 $ gulp

 * */

var gulp = require('gulp');
var sass = require('gulp-sass')
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var prefix = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

// минификация изображений
gulp.task('imgmin', function () {
    return gulp.src('./assets/images/**')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('./dist/images'));
});

// компиляция sass, добавление префиксов
gulp.task('sass', function () {
    gulp.src(['./assets/css/global.scss','./assets/css/pages/*.scss'])
        .pipe(sass())
        .pipe(prefix('last 2 versions', '> 1%', 'ie 7', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('./dist/css'));

});

// минификация css
gulp.task('cssmin', function () {
    gulp.src(['./dist/css/global.css','./dist/css/desktop.css','./dist/css/mobile.css'])
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'));

});

// Линтинг файлов
gulp.task('lint', function () {
    gulp.src('./assets/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Конкатенация и минификация файлов
gulp.task('minify', function () {
    gulp.src(['assets/js/*.js','assets/js/libs/*.js'])
        .pipe(concat('global.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/build'));
});
gulp.task('concat-plugins', function () {
    gulp.src('./assets/js/libs-min/*.js')
        .pipe(concat('aplugins.js'))
        .pipe(gulp.dest('./assets/js/build'))
});
gulp.task('concat-all', function () {
    gulp.src('./assets/js/build/**')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/js'))
});

// Задачи, которые будут выполнятся при изменении файлов
gulp.task('watch', function () {
    gulp.watch('assets/js/*.js', ['lint', 'minify','concat-plugins','concat-all']);
    gulp.watch('assets/css/**', ["sass"]);
//    gulp.watch('./assets/css/**', ["sass"]);
});

// Задачи, которые будут выполнятся при запуске gulp
gulp.task('default', ['cssmin','imgmin','watch']);
