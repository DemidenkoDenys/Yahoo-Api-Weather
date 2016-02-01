'use strict';

var gulp = require('gulp');
var argv = require('yargs').argv;
var gutil = require('gulp-util');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var removeLogs = require('gulp-removelogs');
var ignore = require('gulp-ignore');
var options = require('../config');


function buildScript(file, watch) {

    var workFile;

    if( argv.f !== undefined ){
        workFile = options.scripts.src + argv.f;
    } else {
        workFile = options.scripts.src + file;
    }

    var bundler = browserify({
        entries:workFile,
        debug: !global.production,
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    if ( watch ) {
        bundler = watchify(bundler);
        //bundler.on('update', rebundle);
    }

    bundler.transform("babelify", {presets: ["es2015", "react"]});

    function rebundle() {
        var stream = bundler.bundle()
            .on('error', function (err) {
                console.log(err.toString());
                this.emit("end");
            });

        gutil.log('Rebundle...');

        return stream
            .pipe(source(workFile.match(/([A-z0-9-_]*).js$/g)[0]))
            .pipe(gulp.dest(options.scripts.dest));
    }
    if(global.production) {
         return gulp.src([options.scripts.dest + '/**/*.js', '!' + options.scripts.dest + '/**/*.min.js'] )
             .pipe(removeLogs())
             .pipe(streamify(uglify()))
             .pipe( rename({
                 suffix: '.min'
            }))
            .pipe(gulp.dest(options.scripts.dest));
    } else {
        return rebundle();
    }

}

gulp.task('js', function() {

    // Only run watchify if NOT production
    return buildScript( options.default_js_file, !global.production );

});