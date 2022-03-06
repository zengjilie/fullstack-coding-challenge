const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

const buildStyles = () => {
    return gulp.src(['./public/styles/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest('./public/styles/css'))
}

module.exports = buildStyles;
