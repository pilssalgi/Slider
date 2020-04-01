const gulp        = require('gulp');
const config      = require('../config');
const browserSync = require('browser-sync');
const changed     = require('gulp-changed');
const imagemin    = require('gulp-imagemin');
const pngquant 		= require('imagemin-pngquant');
const mozjpeg 		= require('imagemin-mozjpeg');
const path        = require('path');

const paths = {
  src: path.join(config.base.src, config.imagemin.src),
  dest: path.join(config.base.dest, config.imagemin.dest)
}

gulp.task('imagemin', function() {
  return gulp.src(config.imagemin.src)
    .pipe(changed(config.imagemin.dest)) // Ignore unchanged files
    .pipe(imagemin([
       pngquant({
         quality: '65-80',
         speed: 1,
         floyd:0
       }),
       mozjpeg({
         quality:85,
         progressive: true
       }),
       imagemin.svgo(),
       imagemin.optipng(),
       imagemin.gifsicle()
     ]
  	))
    .pipe(imagemin()) // Optimize
    .pipe(gulp.dest(config.imagemin.dest))
    // .pipe(browserSync.reload({stream:true}))
})

gulp.task('imagemin-watch', ['imagemin'], browserSync.reload);
