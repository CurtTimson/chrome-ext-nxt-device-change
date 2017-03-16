var gulp = require("gulp");

gulp.task("copy-npm-files", function () {
    return gulp.src(['./node_modules/designmodo-flat-ui/dist/**/**'])
        .pipe(gulp.dest('./app/npm/designmodo-flat-ui/dist'))
});

gulp.task('publish', function(){
  return gulp.src('./app/**/**')
    .pipe(gulp.dest('dist'));
});
