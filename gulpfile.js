/*
    To use gulp-image-resize you need to install GraphicsMagick first
    1. sudo apt-get install graphicsmagick
    2. put the images you need to resize into assets/images/to_resize
    3. run gulp image-resize

*/

// Image sizes(width) for gulp-image-resize
var sizes = [1920, 1400, 1024, 768];


// Global options
var options = {
    imgmin: true,
    svgmin: true,
    fonts: true,
    reload: false,
    svghtmlmin: false,
    bump: false,
    gzip: false,
    js: true,
    jsimport: false,
    jshint: true,
    jscs: false,
    webp: false
};

// Modules
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var ignore = require('gulp-ignore');
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
var svgmin = require('gulp-svgmin');
var imagemin = require('gulp-imagemin');
var bump = require('gulp-bump');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var webp = require('gulp-webp');
var imageResize = require('gulp-image-resize');

function add_options(param, array) {
    array = array || [];
    param.forEach(function (key) {
        if (options[key]) {
            array.push(key)
        }
    });
    return array;
}

function errorLog(func) {
    func.on('error', function (error) {
        console.log(error);
    });
    return func;
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
var files = {
    js: 'assets/js/*.js',
    css: ['assets/css/global.scss', 'assets/css/pages/*.scss'],
    html: '[_]*.html'
}
if (options.reload) {
    browserSync = require('browser-sync').create();
    reload = browserSync.reload;
}

//HTML include
gulp.task('htmlimport', function () {
    gulp.src(files.html)
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
    var formats = ['assets/images/**/*.+(jpeg|jpg|png|gif)', '!assets/images/to_resize/**'];
    if (options.webp) {
        gulp.src(formats)
            .pipe(webp())
            .pipe(gulp.dest('dist/images'));
    }
    var stream = gulp.src(formats);
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
        .pipe(svgmin())
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


    // Image resize
    gulp.task('image-resize', function () {
        sizes.forEach(function(size){
            gulp.src('assets/images/to_resize/**/*.+(jpeg|jpg|png|gif)')
                .pipe(imageResize({
                    width : size
                }))
                .pipe(rename({
                    suffix: '-'+ size
                }))
                .pipe(gulp.dest('dist/images/'));
        });
    });

// SCSS
gulp.task('scss', function () {
    gulp.src(files.css)
        .pipe(sourcemaps.init())
        .pipe(errorLog(sass()))
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
            .pipe(errorLog(jscs()));
    });
});

gulp.task('jshint', function () {
    mapJs(function (file) {
        var str = gulp.src(['assets/js/' + file + '.js']);
        if (options.reload) {
            str.pipe(reload({stream: true, once: true}));
        }
        str
            .pipe(errorLog(jshint('.jshintrc')))
            .pipe(jshint.reporter('jshint-stylish'));
    });
});

gulp.task('js', add_options(['jscs', 'jshint']), function () {
    mapJs(function (file) {
        gulp.src(['assets/js/' + file + '/**', 'assets/js/' + file + '.js'])
            .pipe(errorLog(concat(file + '.js')))
            .pipe(gulp.dest('dist/js'))
            .pipe(errorLog(uglify()))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('dist/js'));
    });
});


gulp.task('jsimport', function () {
    gulp.src(files.js)
        .pipe(rigger())
        .pipe(gulp.dest('dist/js/'))
        .pipe(errorLog(uglify()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js/'));
});

// WATCH
gulp.task('watch', function () {
    var watcherJS;
    if (options.reload) {
        browserSync.init({
            logPrefix: 'Live reload: ',
            server: './'
        });
    }

    // JS
    watcherJS = gulp.watch('assets/js/*.js', [add_options(['js', 'jsimport']), reload]);
    if (options.jsimport) {
        watcherJS.on('change', function (event) {
            files.js = event.path;
        });
    }

    // SCSS
    gulp.watch(['assets/css/global.scss', 'assets/css/pages/*.scss'], ['scss', reload])
        .on('change', function (event) {
            files.css = event.path;
        });
    gulp.watch(['assets/css/**/*.scss', '!assets/css/global.scss', '!assets/css/pages/*.scss'], ['scss', reload])
        .on('change', function (event) {
            files.css = ['assets/css/global.scss', 'assets/css/pages/*.scss'];
        });

    // HTML
    gulp.watch('[_]*.html', ['htmlimport', reload])
        .on('change', function (event) {
            files.html = event.path;
        })
        .on('error', function (err) {
            console.log(err);
        });
    gulp.watch('templates/**', ['htmlimport', reload])
        .on('change', function () {
            files.html = '[_]*.html';
        })
        .on('error', function (err) {
            console.log(err);
        });
});

// DEFAULT
default_option = ['tojson', 'scss', 'imgmin', 'watch'];
add_options(['svgmin', 'js', 'jsimport', 'svghtmlmin', 'fonts', 'bump'], default_option);

gulp.task('default', default_option);