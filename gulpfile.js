const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const pm2 = require('pm2');
const nodemon = require('gulp-nodemon');
const rimraf = require('rimraf');
const eslint = require('gulp-eslint');
const changed = require('gulp-changed');
const gutil = require('gulp-util');
const MonorepoTasks = require('gulp-tasks-monorepo');

var repo = MonorepoTasks({
  dir: path.join(__dirname, '/packages/node_modules')
});

repo.task('lint', function(pkg) {
  gutil.log('Lint', pkg.name(), 'package');
  return gulp.src(path.join(pkg.location(), 'src/**/*.js'))
    .pipe(changed('lib'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
});

repo.task('clean', function clean(pkg, done) {
  gutil.log('Clean', pkg.name(), 'package');
  rimraf(path.join(pkg.location(), '/lib'), done);
});

repo.task('compile', (pkg) => {
  gutil.log('Compile', pkg.name(), 'package');
  return gulp.src(path.join(pkg.location(), 'src/**/*.js'))
    .pipe(changed('lib'))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(pkg.location(), 'lib')));
});

repo.task('server', function (pkg) {
  gutil.log('Server', pkg.name(), 'package');
  pm2.connect(true, function () {
    pm2.restart({
      name: pkg.name(),
      script: path.join(pkg.location(), 'index.js'),
      env: {
        'NODE_ENV': 'development',
        'DEBUG': 'mostly:* mongoose:*',
        'APP': 'all'
      }
    }, function () {
      gutil.log('Server started', pkg.name(), 'package');
      pm2.streamLogs('all', 0);
    });
  });
});

repo.task('watch', function(pkg) {
  gutil.log('Watch', pkg.name(), 'package');
  gulp.watch(path.join(pkg.location(), 'src'), ['compile', 'server'])
});

repo.task('default', ['compile', 'server', 'watch']);
