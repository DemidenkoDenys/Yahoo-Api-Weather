/*

 1. Install gulp globally:

 sudo npm install --global gulp

 2. Install gulp in your project devDependencies:

 sudo npm install --save-dev gulp
 sudo npm install gulp-sass gulp-jshint gulp-concat gulp-rename gulp-uglify gulp-autoprefixer gulp-cssmin gulp-imagemin imagemin-pngcrush gulp-connect run-sequence

 3. Run gulp:

 $ gulp

 */

var fs = require( 'fs' );
var path = require( 'path' );
var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' )
var jshint = require( 'gulp-jshint' );
var concat = require( 'gulp-concat' );
var rename = require( 'gulp-rename' );
var uglify = require( 'gulp-uglify' );
var prefix = require( 'gulp-autoprefixer' );
var cssmin = require( 'gulp-cssmin' );
var imagemin = require( 'gulp-imagemin' );
var pngcrush = require( 'imagemin-pngcrush' );
var sequence = require( 'run-sequence' );
var connect = require( 'gulp-connect' );

gulp.task( 'connect', function () {
    connect.server( {
        root: 'app',
        livereload: true
    } );
} );

// HTML, Images, Fonts

gulp.task( 'html', function () {
    gulp.src( '*.html' )
        .pipe( connect.reload() );
} );

gulp.task( 'imgmin', function () {
    return gulp.src( 'assets/images/**' )
        .pipe( imagemin( {
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false}
            ],
            use: [pngcrush()]
        } ) )
        .pipe( gulp.dest( 'dist/images' ) );
} );

gulp.task( 'fonts', function () {
    gulp.src( 'assets/fonts/**' )
        .pipe( gulp.dest( 'dist/fonts' ) );
} );

// CSS

gulp.task( 'sass', function () {
    gulp.src( ['assets/css/global.scss', 'assets/css/pages/*.scss'] )
        .pipe( sass() )
        .pipe( prefix( 'last 2 versions', '> 1%', 'ie 7', 'ie 8', 'ie 9' ) )
        .pipe( gulp.dest( 'dist/css' ) )
        .pipe( connect.reload() );
} );

gulp.task( 'cssmin', function () {
    gulp.src( './dist/css/*.css' )
        .pipe( cssmin() )
        .pipe( gulp.dest( 'dist/css/min' ) );
} );

// JS

function getFiles( dir ) {
    return fs.readdirSync( dir )
        .filter( function ( file ) {
            return fs.statSync( path.join( dir, file ) ).isFile();
        } );
}

gulp.task( 'lint', function () {
    gulp.src( 'assets/js/*.js' )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default' ) )
        .pipe( connect.reload() );
} );

gulp.task( 'concat', function () {
    getFiles( 'assets/js' )
        .forEach( function ( file ) {
            file = file.slice( 0, -3 );
            gulp.src( ['assets/js/' + file + '/**', 'assets/js/' + file + '.js'] )
                .pipe( concat( file + '.js' ) )
                .pipe( gulp.dest( 'dist/js' ) );
        } );
} );

gulp.task( 'minify', function () {
    gulp.src( 'dist/js/*.js' )
        .pipe( uglify() )
        .pipe( gulp.dest( 'dist/js/min' ) );
} );

// WATCH

gulp.task( 'css', function ( callback ) {
    sequence( 'sass', 'cssmin', callback );
} );

gulp.task( 'js', function ( callback ) {
    sequence( 'lint', 'concat', 'minify', callback );
} );

gulp.task( 'watch', function () {
    gulp.watch( '*.html', ['html'] );
    gulp.watch( 'assets/js/**/*.js', ['js'] );
    gulp.watch( 'assets/css/**/*.scss', ['css'] );
} );

gulp.task( 'default', ['css', 'js', 'imgmin', 'fonts', 'connect', 'watch'] );
