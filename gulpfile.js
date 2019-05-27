const {task, src, dest, watch, series, parallel} = require('gulp');

//     concat = require('gulp-concat'),  ------> vendors

// Plugins relacionados a CSS
let sass            = require('gulp-sass');
let autoprefixer    = require('gulp-autoprefixer');

// Plugins relacionados con imagenes
let images        = require('gulp-imagemin');


// Plugins relacionados con JS
let uglify          = require('gulp-uglify');
let babelify        = require('babelify');
let browserify      = require('browserify');
let source          = require('vinyl-source-stream');
let buffer          = require('vinyl-buffer');
let stripDebug      = require( 'gulp-strip-debug' );


// Plugins de utilidad
let rename          = require('gulp-rename');
let sourcemaps      = require('gulp-sourcemaps');
let notify          = require('gulp-notify');
let plumber         = require('gulp-plumber');
let options         = require('gulp-options');
let gulpif          = require( 'gulp-if' );

// Plugins relacionados con el navegador
let browserSync     = require('browser-sync').create(),
    reload          = browserSync.reload;

/**
 * ===============================
 *            PATHS
 * ===============================
 */

// CSS
let styleSrc        = 'source/sass/**/*.scss';
let styleDest       = 'build/assets/css/';
let styleWatch      = './source/sass/**/*.scss';

// JS
let scriptSrc       = 'app.js';
let jsFolder        = 'source/js/';
let scriptDest      = 'build/assets/js/';
let jsFILES         = [scriptSrc];
let jsWatch         = './source/js/**/*.js';
let vendorSrc       = './source/sass/**/*.scss';
let vendorDest      = 'build/assets/js/';

// HTML
let htmlDest        = 'build/*.html';

// IMG

let imgSrc          = ['./source/img/*/*','./source/img/*.jpg', './source/img/*.png'];
let imgDest         = './build/assets/img/';

// FONTS
let fontSrc         = 'source/fonts/*.ttf';
let fontDest        = './build/assets/fonts/';

// 3RD PARTY STYLES
let bootSrc         = 'node_modules/bootstrap/scss/bootstrap.scss';
let slickSrc        = 'node_modules/slick-carousel/slick/slick.css';
let slickTSrc       = 'node_modules/slick-carousel/slick/slick-theme.css';
let fawsrc          = 'node_modules/@fortawesome/fontawesome-free/css/all.css';


// --------------------------------------------
// Tareas
// --------------------------------------------




// gulp.task('images', function() {
//     gulp.src(['src/img/*/*','src/img/*.jpg', 'src/img/*.png'])
//         .pipe(images())
//         .pipe(gulp.dest('dist/img'));
// });

// //Concatenar y comprimir archivos 3rd party


// // Observar cambios
// gulp.task('watch', function(){

//     // Serve files from the root of this project
//     browserSync.init({
//         server: {
//             baseDir: "./dist"
//         },
//         notify: false
//     });

//     // Observamos si hay cambios en bootrstrap o mis estilos sass, si los hay ejecutamos la tarea SASS
//     gulp.watch([bootSrc, styleSrc],gulp.parallel('sass'));
//     // Observamos cambios en la ruta de nuestros scripts, si los hay ejecutamos tarea scripts
//     gulp.watch(jsFolder+scriptSrc,gulp.parallel('scripts'));
//     // Observamos cambios en ruta vendors, si hay ejecutamos tarea vendors
//     // gulp.watch(vendorSrc,['vendors']);
//     // Al ejecutarse las tareas anteriores, los archivos en build se actualizaran, por lo tanto cambiaran
//     // Entonces estamos observando por cambios en esos archivos, si los hay, usamos evento
//     // "change" para recargar el navegador con la dependencia browserSync
//     gulp.watch(['dist/*.html', 'dist/css/*.css', 'dist/js/*.js']).on('change', browserSync.reload);

// });


// // Usar la tarea default para correr todas las tareas mas aparte la tarea watch y observar cambios
// // gulp.task('default', [ 'sass', 'scripts', 'vendors', 'watch'], function () {});
// gulp.task('default', gulp.parallel('sass', 'scripts', 'watch'), function () {});


function browser_sync(){
    browserSync.init({
        server: {
            baseDir: "./build/"
        },
        notify: false
    });
}

function reloaded(done){
    browserSync.reload();
    done();
}

function styles(done){
    src( [styleSrc,bootSrc,slickSrc,slickTSrc,fawsrc] )
    .pipe( sourcemaps.init() )
    .pipe( sass({
        errLogToConsole: true,
        outputStyle: 'compressed'
    }) )
    .on( 'error', console.error.bind(console) )
    .pipe( autoprefixer({ browsers: [ 'last 2 versions', '> 5%', 'Firefox ESR' ] }) )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( sourcemaps.write( './' ) )
    .pipe( dest( styleDest ) )
    .pipe( browserSync.stream() );

    done();
}

function faw(done){
    src('./node_modules/@fortawesome/fontawesome-free/js/all.min.js')
    .pipe(dest(scriptDest));

    done();
}

function js(done){
    jsFILES.map(function( entry ){
        return browserify({
            entries: [jsFolder + entry]
        })
        .transform( babelify, {presets: ['@babel/preset-env']} )
        .bundle()
        .pipe( source( entry ) )
        .pipe( rename({ extname: '.min.js' }) )
        .pipe( buffer() )
        .pipe( sourcemaps.init({ loadMaps: true }) )
        .pipe( uglify() )
        .pipe( sourcemaps.write( './' ) )
        .pipe( dest( scriptDest ) )
        .pipe( browserSync.stream() );
    });

    done();
}
function triggerPlumber(src_files, url_files){
    return src(src_files)
        .pipe( plumber() )
        .pipe( dest(url_files) );
}
function img(){
    // return triggerPlumber(imgSrc, imgDest);
    return src(imgSrc)
    .pipe( images() )
    .pipe( dest(imgDest) );
}
function fonts(){
    return triggerPlumber(fontSrc, fontDest);
}

function watch_files(){
    watch( styleWatch, styles );
    watch( jsWatch , series(js, reloaded) );
    watch( htmlDest, reloaded );
    watch( fontSrc, series(fonts, reloaded) );
    watch( imgSrc, series(img, reloaded) );
    src(scriptDest + 'app.min.js')
    .pipe( notify({message: 'Gulp is watching, Happy Coding!'}) );
}

task('styles', styles);
task('js', js);
task('img', img);
task('fonts', fonts);
task('watch', parallel(browser_sync, watch_files ));
task('faw', faw);
// task("default", series(styles, js, img, fonts));