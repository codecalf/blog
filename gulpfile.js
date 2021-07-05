//constants
const src_path = "src";
const dest_path = "dest";

//import important packages

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const browserSync = require("browser-sync");

// sass -> css

const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require("gulp-autoprefixer");

// ts -> js

const ts = require("gulp-typescript");

// html

const htmlmin = require("gulp-htmlmin");

function css(done) {
    return gulp.src(`${src_path}/sass/main.sass`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "compressed" }).on('error', sass.logError))
        .pipe(rename({suffix:".min"}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write(""))
        .pipe(gulp.dest(`${dest_path}/css/`))
        .pipe(browserSync.stream())
}

function script(done) {
    return gulp.src(`${src_path}/ts/*.ts`)
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(ts())
        .pipe(sourcemaps.write(""))
        .pipe(gulp.dest(`${dest_path}/js`))
}

function html(done) {
    return gulp.src(`${src_path}/*.html`)
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            html5: true,
            removeEmptyAttributes: true,
            removeTagWhitespace: true,
            sortAttributes: true,
            sortClassName: true}))
        .pipe(gulp.dest(`${dest_path}`))
}

function reload(done) {
    browserSync.reload();
    done();
}


function watch() {
    browserSync.init({
        server: {
            baseDir: `${dest_path}`
        }
    })

    gulp.watch(`${src_path}/sass/**/*.sass`, css);
    gulp.watch(`${src_path}/ts/**/*.ts`, gulp.series(script, reload));
    gulp.watch(`${src_path}/*.html`, gulp.series(html, reload));
}



exports.default = watch