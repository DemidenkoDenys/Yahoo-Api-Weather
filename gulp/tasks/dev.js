'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var options = require('../config');

gulp.task('dev', function(cb) {

    cb = cb || function() {};

    global.production = false;

    runSequence(['scss', 'js', 'htmlimport', 'watch'], cb);


});