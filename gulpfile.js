var gulp = require("gulp");

gulp.task('publish', function(){
  return gulp.src('./app/**/**')
    .pipe(gulp.dest('dist'));
});
