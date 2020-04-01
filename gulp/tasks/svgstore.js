'use strict';

var path        = require('path');
var gulp        = require('gulp');
var rename      = require('gulp-rename');
var cheerio     = require('gulp-cheerio');
var svgstore    = require('gulp-svgstore');
var imagemin    = require('gulp-imagemin');
var config      = require('../config');

gulp.task('svgstore', function () {
	return gulp.src(config.svgstore.src)
		.pipe(svgstore())
		.pipe(cheerio({
			run: function ($) {
				return $('svg').attr({
					display: 'none'
				}).removeAttr('xmlns');
			},
			parserOptions: {
				xmlMode: true
			}
		}))
		.pipe(imagemin({
			svgoPlugins: config.imagemin.svgo
		}))
		.pipe(rename(function (path) {
			return path.basename = config.svgstore.destFileName;
		}))
		.pipe(gulp.dest(config.svgstore.dest));
});
