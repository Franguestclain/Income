// --------------------------------------------
// Paquetes (Dependencias)
// --------------------------------------------
var autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    images = require('gulp-imagemin'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    browserSync = require('browser-sync').create();


// paths
var styleSrc = 'source/sass/**/*.scss',
    styleDest = 'build/assets/css/',
    bootSrc = 'node_modules/bootstrap/scss/bootstrap.scss',
    htmlSrc = 'source/',
    htmlDest = 'build/',
    vendorSrc = 'source/js/vendors/',
    vendorDest = 'build/assets/js/',
    scriptSrc = 'app.js',
    jsFolder = 'source/js/',
    scriptDest = 'build/assets/js/',
    jsFILES = [scriptSrc];



// --------------------------------------------
// Tareas
// --------------------------------------------


// Compilar los archivos SASS
gulp.task('sass', function() {
    gulp.src(['node_modules/bootstrap/scss/bootstrap.scss','node_modules/slick-carousel/slick/slick.css','node_modules/slick-carousel/slick/slick-theme.css','source/sass/**/*.scss'])
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(rename({
            suffix: '.min'
          }))

        .pipe(gulp.dest('build/assets/css'));
});

gulp.task('images', function() {
    gulp.src(['source/img/*/*','source/img/*.jpg', 'source/img/*.png'])
        .pipe(images())
        .pipe(gulp.dest('build/assets/img'));
});

// Transpilar y minificar JS
gulp.task('scripts', function() {

    jsFILES.map(function( entry ){
        return browserify({
            entries: [jsFolder + entry]
        })
        .transform( babelify, {presets: ['env']} )
        .bundle()
        .pipe( source( entry ) )
        .pipe( rename({ extname: '.min.js' }) )
        .pipe( buffer() )
        .pipe( sourcemaps.init({ loadMaps: true }) )
        .pipe( uglify() )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( scriptDest ) )
    });
});

//Concatenar y comprimir archivos 3rd party
gulp.task('vendors', function() {
    gulp.src(
            [
                'node_modules/jquery/dist/jquery.js',
                'node_modules/slick-carousel/slick/slick.js',
                'source/js/vendors/fontawesome-all.min.js',
                'source/js/vendors/*.js'
            ])
        .pipe(plumber())
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js/vendors'));
});


gulp.task('fonts', function(){
    gulp.src(['source/fonts/*.otf'])
        .pipe(gulp.dest('build/assets/fonts'));
});



// Observar cambios
gulp.task('watch', function(){

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        notify: false
    });

    // Observamos si hay cambios en bootrstrap o mis estilos sass, si los hay ejecutamos la tarea SASS
    gulp.watch([bootSrc, styleSrc],['sass']);
    // Observamos cambios en la ruta de nuestros scripts, si los hay ejecutamos tarea scripts
    gulp.watch(jsFolder+scriptSrc,['scripts']);
    // Observamos cambios en ruta vendors, si hay ejecutamos tarea vendors
    gulp.watch(vendorSrc,['vendors']);
    // Al ejecutarse las tareas anteriores, los archivos en build se actualizaran, por lo tanto cambiaran
    // Entonces estamos observando por cambios en esos archivos, si los hay, usamos evento
    // "change" para recargar el navegador con la dependencia browserSync
    gulp.watch(['build/*.html', 'build/assets/css/*.css', 'build/assets/js/*.js', 'build/assets/js/vendors/*.js']).on('change', browserSync.reload);

});


// Usar la tarea default para correr todas las tareas mas aparte la tarea watch y observar cambios
gulp.task('default', [ 'sass', 'scripts', 'vendors', 'watch'], function () {});


//watchify