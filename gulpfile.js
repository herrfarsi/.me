var gulp = require('gulp'),
$    = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;


var handleError = function (err) {
  $.notify.onError()(err);
  this.emit('end');
};

// Default
gulp.task('default', function () {
  browserSync({
    server: "./public_html",
    notify: false
  });
  gulp.watch('assets/templates/**/*.twig', ['twig']);
  gulp.watch('assets/sass/**/*.scss', ['sass']);
  gulp.watch('assets/img/**/*', ['images']);
  //gulp.watch('public_html/assets/css/*.css').on('change', reload);
  gulp.watch('assets/js/**/*.js', ['lint', 'scripts']).on('change', reload);
});

var sassTask = function() {
  return gulp.src('assets/sass/**/*.scss')
  .pipe($.cssGlobbing({
      extensions: ['.scss']
  }))
  .pipe($.sass())
  .on('error', handleError)
  .pipe($.autoprefixer())
  .pipe($.rename({ suffix: '.min' }))
  .pipe($.minifyCss())
  .pipe(gulp.dest('assets/css', { cwd: 'public_html' }))
  .pipe(reload({stream: true}))
}
// Sass
gulp.task('sass', sassTask);

// Twig
var twigTask = function(){
  return gulp.src([
    '!assets/templates/layout.twig',
    'assets/templates/*.twig'
  ])
  .pipe($.twig())
  .pipe(gulp.dest('public_html')).pipe(reload({stream: true}));
}
gulp.task('twig', function () {
  twigTask();
});
   
// Script linting
gulp.task('lint', function () {
  return gulp.src('assets/js/*.js')
  .pipe($.jshint())
  .pipe($.jshint.reporter('jshint-stylish'))
  .pipe($.notify(function (file) {
    if (file.jshint.success) {
      return false;
    }
    var errors = file.jshint.results.map(function (data) {
      if (data.error) {
        return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
      }
    }).join("\n");
    return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
  }));
});

var scriptsTask = function() {
  return gulp.src([
    'assets/js/vendor/*.js',
    'assets/js/*.js',
    ])
  .pipe($.concat('scripts.js'))
  .pipe(gulp.dest('public_html/assets/js'))
  .pipe($.rename({ suffix: '.min' }))
  .pipe($.uglify())
  .on('error', handleError)
  .pipe(gulp.dest('assets/js', { cwd: 'public_html' }))
}
// Script concat and uglify
gulp.task('scripts', scriptsTask);

gulp.task('images', function () {
    return gulp.src('assets/img/**/*')
      .pipe($.imagemin({
          progressive: true,
          multipass: true,
          svgoPlugins: [
            //{ mergePaths: false}, // Don't merge paths since we want to animate some of them.
                                  // NOTE! this leads to larger file size.
            { removeTitle: true }, // Remove title generated by Sketch
            { removeDesc: true } // Remove desc generated by Sketch
]
      }))
      .pipe(gulp.dest('public_html/assets/img'));
});