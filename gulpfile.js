/**
 *
 *  1. Check the version node.js ( 0.10.25) and npm ( 2.3.0)
 *
 *  node -v
 *  npm -v
 *
 *  If the version does not match, update
 *
 *  sudo npm cache clean -f
 *  sudo npm install -g n
 *  sudo n stable
 *
 *  2. install modules
 *  sudo npm install
 *
 *  4. Run gulp
 *  gulp
 *
 */

// Global options
var options = {
    imgmin: true,
    svgo: true,
    fonts: true,
    reload: false,
    svghtmlmin: false,
    bump: false,
    gzip: false,
    js: true,
    jsimport: false,
    jshint: false,
    jscs: false
}

// Modules
var js_option, default_optionvar;
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cmq = require('gulp-combine-media-queries');
var cssMin = require('gulp-cssmin');
var csscomb = require('gulp-csscomb');
var rigger = require('gulp-rigger');
var sourcemaps = require('gulp-sourcemaps');
var toJson = require('gulp-to-json');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var pngcrush = require('imagemin-pngcrush');
var svgo = require('gulp-svgo');
var imagemin = require('gulp-imagemin');
var bump = require('gulp-bump');
var gzip = require('gulp-gzip');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');

function add_options(param, array) {
    array = array || [];
    param.forEach(function (key) {
        if (options[key]) {
            array.push(key)
        }
    });
    return array;
}

// Services
gulp.task('bump', function () {
    gulp.src('./bower.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('tojson', function () {
    gulp.src('[_]*.html')
        .pipe(toJson({
            relative: true,
            filename: 'pages.json',
            strip: /^_|(.html)/g
        }));
});

// live reload
var browserSync;
var reload = function () {
};

if (options.reload) {
    browserSync = require('browser-sync').create();
    reload = browserSync.reload;
}


//HTML include
gulp.task('htmlimport', function () {
    gulp.src('[_]*.html')
        .pipe(rigger())
        .pipe(rename(function (path) {
            var newName = path.basename;
            if (newName.charAt(0) === '_')
                newName = newName.slice(1);
            path.basename = newName;
        }))
        .pipe(gulp.dest(''));
});

// Images, SVG, Fonts
gulp.task('imgmin', function () {
    var stream = gulp.src(['assets/images/**/*.jpg', 'assets/images/**/*.jpeg', 'assets/images/**/*.png', 'assets/images/**/*.gif']);
    if (options.imgmin) {
        stream.pipe(imagemin({
            progressive: true,
            use: [pngcrush()]
        }))
    }
    stream.pipe(gulp.dest('dist/images'));
    return stream;
});

gulp.task('svgmin', function () {
    gulp.src('assets/images/**/*.svg')
        .pipe(svgo())
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('svghtmlmin', function () {
    return gulp.src('templates/svg/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('templates/svg/'))
});

gulp.task('fonts', function () {
    gulp.src('assets/fonts/**')
        .pipe(gulp.dest('dist/fonts'));
});

// SCSS
gulp.task('scss', function () {
    gulp.src(['assets/css/global.scss', 'assets/css/pages/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', function (err) {
            console.log(err);
        }))
        .pipe(prefix('last 2 versions', '> 1%', 'ie 10'))
        .pipe(cmq({
            log: false
        }))
        .pipe(sourcemaps.write())
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

gulp.task('jshint', function () {
    mapJs(function (file) {
        var str = gulp.src(['assets/js/' + file + '.js']);
        if (options.reload) {
            str.pipe(reload({stream: true, once: true}));
        }
        str
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('jshint-stylish'));
    });
});

gulp.task('js', add_options(['jscs', 'jshint']), function () {
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


gulp.task('jsimport', function () {
    gulp.src('assets/js/*.js')
        .pipe(rigger())
        .pipe(gulp.dest('dist/js/'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js/'));
});

// GZIP JS & CSS
gulp.task('gzip', function () {
    gulp.src('./dist/js/*.min.js')
        .pipe(gzip())
        .pipe(gulp.dest('./dist/js/'));
    gulp.src('./dist/css/*.min.css')
        .pipe(gzip())
        .pipe(gulp.dest('./dist/css/'));
});

// WATCH
gulp.task('watch', function () {

    if (options.reload) {
        browserSync.init({
            logPrefix: 'Live reload: ',
            server: './'
        });
    }
    gulp.watch('assets/js/**/*.js', [add_options(['js', 'jsimport']), reload]);
    gulp.watch('[_]*.html', ['htmlimport', reload]);
    gulp.watch('assets/css/**/*.scss', ['scss', reload]);
});

// DEFAULT
default_option = ['tojson', 'scss', 'imgmin', 'watch'];
add_options(['svgmin', 'js', 'jsimport', 'svghtmlmin', 'fonts', 'bump', 'gzip'], default_option);

gulp.task('default', default_option);