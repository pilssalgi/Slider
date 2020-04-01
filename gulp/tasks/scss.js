require('es6-promise').polyfill();
var gulp         = require('gulp');
var config       = require('../config');
var path         = require('path');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS    = require('gulp-clean-css');
var handleErrors = require('../lib/handleErrors');
var browserSync  = require('browser-sync');


var paths = {
  // src: path.join(config.base.src, config.css.src),
  dest: path.join(config.base.dest, config.css.dest)
}

gulp.task('scss', function() {
  return gulp.src(config.css.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', handleErrors)
    .pipe(autoprefixer(config.css.autoprefixer))
    .pipe(sourcemaps.write())
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.reload({stream:true}));
});