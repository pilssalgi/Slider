var gulp        = require('gulp');
var config      = require('../config');
var browserSync = require('browser-sync');
var minifyhtml  = require('gulp-minify-html');
var path        = require('path');
var fileinclude = require('gulp-file-include');

var paths = {
	// src: path.join(config.base.src, config.html.src),
	dest: path.join(config.base.dest, config.html.dest)
}

gulp.task('minifyhtml',function(){
	return gulp.src(config.html.src)
		// .pipe(minifyhtml())
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest(paths.dest))
		.pipe(browserSync.reload({stream:true}));
});