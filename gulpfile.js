const fs = require('fs');
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
  var configFile = path.join(pkg.location(), 'process_development.json');
  fs.readFile(configFile, function(err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        gutil.log(' => Skip not a server', pkg.name());
        return;
      }
      throw err;
    }
    var config = JSON.parse(data);
    config.apps.forEach(function(app) {
      app.script = path.join(pkg.location(), app.script);
      app.error_file = path.join(pkg.location(), app.error_file);
      app.out_file = path.join(pkg.location(), app.out_file);
    });
    pm2.connect(true, function (err) {
      if (err) throw err;
      pm2.restart(config, function (err, apps) {
        if (err) throw err;
        gutil.log('Server started', pkg.name(), 'package');
        pm2.streamLogs('all', 0);
      });
    });
  });
});

repo.task('watch', function(pkg) {
  gutil.log('Watch', pkg.name(), 'package');
  gulp.watch(path.join(pkg.location(), 'src/**/*.js'), ['compile', 'server'])
});

repo.task('default', ['compile', 'server', 'watch']);
