var config      = require('../config');
var path        = require('path');
var gulp   			= require('gulp');
var pug 				= require("gulp-pug");
var data 				= require("gulp-data");
var fs 					= require("fs");
let browserSync   = require('browser-sync');

var paths = {
	dest: path.join(config.base.dest, config.html.dest)
}
gulp.task("pug", function() {
	gulp.src(
		 ["src/**/*.pug",'!' + "src/**/_*.pug"] //参照するディレクトリ、出力を除外するファイル
	)
	// .pipe(data( file => {
 //      return JSON.parse(fs.readFileSync(`./src/pages.json`));
 //  }))
	.pipe(pug({basedir: config.pug.basedir}))
	.pipe(gulp.dest(paths.dest))
	.pipe(browserSync.reload({stream:true}));
	// .pipe(gulp.dest("dest/")) //出力先
});