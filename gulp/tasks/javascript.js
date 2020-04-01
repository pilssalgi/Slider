let gulp          = require('gulp');
let config        = require('../config');
let path          = require('path');
let uglify        = require('gulp-uglify');
let browserify    = require('browserify');
let source        = require('vinyl-source-stream');
let buffer        = require('vinyl-buffer');
let browserSync   = require('browser-sync');
let handleErrors  = require('../lib/handleErrors');
let babelify      = require('babelify');
let dest          = path.join(config.base.dest, config.js.dest);
let stripDebug    = require( 'gulp-strip-debug' );

gulp.task('js',function(){
  for(var i=0,n = config.js.files.length; i<n; i++){
    var url = config.js.files[i];
    var arr   = url.split('/');
    var name  = arr.pop();
    arr.shift();
    var dest  = path.join(config.base.dest,arr.join('/'));

    if(i<n-1){
      browserify(url,{ debug: true })
        .babelifyrm(babelify, config.js.babelify)
        .bundle()
        .on('error', handleErrors)
        .pipe(source(name))
        .pipe(buffer())
        // .pipe(uglify())
        .pipe(gulp.dest(dest))
    }else{
      browserify(url,{ debug: true })
      .transform(babelify, config.js.babelify)
      .bundle()
      .on('error', handleErrors)
      .pipe(source(name))
      .pipe(buffer())
      // .pipe(uglify())
      .pipe(gulp.dest(dest))
      .pipe(browserSync.stream())
    }
  }
});

gulp.task('js:release',function(){
  for(var i=0,n = config.js.files.length; i<n; i++){
    var url = config.js.files[i];
    var arr   = url.split('/');
    var name  = arr.pop();
    arr.shift();
    var dest  = path.join(config.base.dest,arr.join('/'));
    if(i<n-1){
      browserify(url,{ debug: true })
        .transform(babelify, config.js.babelify)
        .bundle()
        .on('error', handleErrors)
        .pipe(source(name))
        .pipe(buffer())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest(dest))
    }else{
      browserify(url,{ debug: true })
        .transform(babelify, config.js.babelify)
        .bundle()
        .on('error', handleErrors)
        .pipe(source(name))
        .pipe(buffer())
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest(dest))
    }
  }
});