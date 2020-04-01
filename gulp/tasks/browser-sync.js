var gulp    = require('gulp');
var config  = require('../config');
var browserSync = require('browser-sync');


var option = {
  server  : {baseDir: config.base.dest},
  port    : 8000,
  browser : "google chrome"
}

gulp.task('browserSync',['scss','svgstore','pug','js'],function(){
  return browserSync.init(option);
});