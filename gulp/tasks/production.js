'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var options = require('../config');

gulp.task('prod', function(cb) {

    cb = cb || function() {};

    global.production = true;

    runSequence(['scss', 'js', 'htmlimport', 'fonts',  'images', 'webp', 'tojson'], cb);

});