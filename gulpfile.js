// Intialize the module
const {src, dest, watch, series, parallel} = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

//File path Variables
const files = {
    // src url
    scssPath: 'src/sass/**/*.scss',
    jsPath: 'src/js/**/*.js',

    //dest url
    destScsspath: 'dist/css',
    destJspath: 'dist/js'
}

//Sass task
function scssTask() {
    return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(),cssnano]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(files.destScsspath));
}

//Js task
function jstask() {
    return src(files.jsPath)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest(files.destJspath));
}

//Cachebusting task
const cbstring = new Date().getTime();
function cacheBustTask() {
    return src(['index.html'])
    .pipe(replace(/cb=\d+/g,'cb=' +cbstring))
    .pipe(dest('.'))
}

//Watch task
function watchTask() {
    watch([files.scssPath,files.jsPath],
        parallel(scssTask,jstask));
}

//Default task

exports.default= series(
    parallel(scssTask,jstask),
    cacheBustTask,
    watchTask
);

