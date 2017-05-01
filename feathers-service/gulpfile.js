const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const makeCache = require('gulp-file-cache');

const cache = new makeCache();

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(cache.filter())
    .pipe(eslint())
    .pipe(cache.cache())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
});

gulp.task('compile', () => {
  return gulp.src('src/**/*.js')
    .pipe(cache.filter())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(cache.cache())
    .pipe(gulp.dest('lib'));
});

gulp.task('watch', () => {
  return nodemon({
    script: 'index.js',
    watch: 'src',
    nodeArgs: ['--preserve-symlinks'],
    env: {
      'NODE_ENV': 'development',
      'DEBUG': 'mostly:* mongoose:*',
      'APP': 'all'
    },
    tasks: ['lint', 'compile']
  });
});

gulp.task('default', ['lint', 'compile', 'watch']);
