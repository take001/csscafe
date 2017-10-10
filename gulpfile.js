var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var browserSync   = require('browser-sync');


var paths = {
  "htmlSrc" : "./site/*.html",
  "scssSrc" : "./site/src/scss/**/*.scss",
  "jsSrc"   : "./site/src/js/*.js",
  "jsLib"   : "./site/src/js/lib/*.js",
  "imgSrc"  : "./site/src/images/**",
  "rootDir" : "./site/dist/",
  "imgDir"  : "./site/dist/images/",
  "jsDir"  : "./site/dist/js/"
}


gulp.task('bs', function() {
  browserSync.init({
    server: {
      baseDir: "./site/"
    },
    notify  : true,
    xip     : false
  });
});

gulp.task('scss', function() {
  return gulp.src(paths.scssSrc)
    .pipe($.sourcemaps.init())
      .pipe($.sass()).on('error', $.sass.logError)
      .pipe($.autoprefixer({
        browsers: ['last 2 versions']
      }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(paths.rootDir + 'css'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.csso())
    .pipe(gulp.dest(paths.rootDir + 'css'))
    .pipe(browserSync.reload({
      stream: true,
      once  : true
    }));
});

gulp.task('bs-reload', function() {
   browserSync.reload();
});

gulp.task('image', function() {
  return gulp.src(paths.imgSrc)
    .pipe($.changed(paths.imgDir))
    .pipe($.imagemin({
      optimizationLevel: 3
    }))
    .pipe(gulp.dest(paths.imgDir));
});

gulp.task('js', function() {
  return gulp.src([paths.jsLib, paths.jsSrc])
    .pipe($.uglify({preserveComments: 'license'}))
    .pipe($.concat('main.min.js', {newLine: '\n'})
    )
    .pipe(gulp.dest(paths.jsDir));
});

gulp.task('default', ['image', 'js', 'bs', 'scss', 'bs-reload'], function() {
  $.watch([paths.htmlSrc],function(e) {
    gulp.start("bs-reload")
  });
  $.watch([paths.scssSrc],function(e) {
    gulp.start("scss")
  });
  $.watch([paths.imgSrc],function(e) {
    gulp.start("image")
  });
  $.watch([paths.jsSrc],function(e) {
    gulp.start("js")
  });
});
