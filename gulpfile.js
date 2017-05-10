const gulp = require('gulp');
const gutil = require('gulp-util');
const spawn = require('child_process').spawn;
const glob = require('glob');
const path = require('path');
const util = require('util');

const gulpfiles = './packages/node_modules/*/gulpfile.js';

// Task for each package
var files = glob.sync(path.join(__dirname, gulpfiles));
var tasks = [];
files.forEach(function(file) {
  var package = path.basename(path.dirname(file));
  gulp.task(package, function() {
    var child = spawn('gulp', ['--gulpfile', file], { stdio: 'inherit' });
  });
  tasks.push(package);
});

gulp.task('default', tasks);
