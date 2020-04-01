var gulp   = require('gulp');
var config = require('../config');
var path   = require('path');


gulp.task('watch',['browserSync'], function() {
  gulp.watch(config.imagemin.watch,['imagemin-watch']);
  gulp.watch(config.copy.watch,['copy']);
  gulp.watch(config.css.watch,['scss']);
  gulp.watch(config.svgstore.watch, ['svgstore']);
  gulp.watch(config.pug.watch,['pug']);
  gulp.watch(config.js.watch,['js']);
  // gulp.watch(config.html.watch,['minifyhtml']);
})
