var gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
  gulp.src('index.js')
});

gulp.task('watch', function () {
    gulp.watch('index.js',['default']); //当所有less文件发生改变时，调用testLess任务
});