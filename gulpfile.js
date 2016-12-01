var gulp = require('gulp');
var gutil = require('gulp-util');
var ddescribeIit = require('gulp-ddescribe-iit');
var shell = require('gulp-shell');
var ghPages = require('gulp-gh-pages');
var gulpFile = require('gulp-file');
var del = require('del');
var clangFormat = require('clang-format');
var gulpFormat = require('gulp-clang-format');
var runSequence = require('run-sequence');
var tslint = require('gulp-tslint');
var webpack = require('webpack');
var typescript = require('typescript');
var exec = require('child_process').exec;
var path = require('path');
var os = require('os');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

var PATHS = {
  src: 'src/**/*.ts',
  srcIndex: 'src/index.ts',
  specs: 'src/**/*.spec.ts',
  testHelpers: 'src/test/**/*.ts',
  typings: 'typings/index.d.ts',
  jasmineTypings: 'typings/globals/jasmine/index.d.ts',
  coverageJson: 'coverage/json/coverage-final.json'
};

function platformPath(path) {
  return /^win/.test(os.platform()) ? `${path}.cmd` : path;
}

function webpackCallBack(taskName, gulpDone) {
  return function(err, stats) {
    if (err) throw new gutil.PluginError(taskName, err);
    gutil.log(`[${taskName}]`, stats.toString());
    gulpDone();
  }
}

// Transpiling & Building

gulp.task('clean:build', function() { return del('dist/'); });

gulp.task('ngc', function(cb) {
  var executable = path.join(__dirname, platformPath('/node_modules/.bin/ngc'));
  exec(`${executable} -p ./tsconfig.json`, (e) => {
    if (e) console.log(e);
    del('./dist/waste');
    cb();
  }).stdout.on('data', function(data) { console.log(data); });
});

gulp.task('npm', function() {
  var pkgJson = require('./package.json');
  var targetPkgJson = {};
  var fieldsToCopy = ['version', 'description', 'keywords', 'author', 'repository', 'license', 'bugs', 'homepage'];

  targetPkgJson['name'] = '@slyedoc/angular-odata';

  fieldsToCopy.forEach(function(field) { targetPkgJson[field] = pkgJson[field]; });

  targetPkgJson['main'] = 'index.js';
  targetPkgJson['module'] = 'index.js';
  targetPkgJson['typings'] = 'index.d.ts';

  targetPkgJson.peerDependencies = {};
  Object.keys(pkgJson.dependencies).forEach(function(dependency) {
    targetPkgJson.peerDependencies[dependency] = `^${pkgJson.dependencies[dependency]}`;
  });

  return gulp.src('README.md')
      .pipe(gulpFile('package.json', JSON.stringify(targetPkgJson, null, 2)))
      .pipe(gulp.dest('dist'));
});

gulp.task('changelog', function() {
  var conventionalChangelog = require('gulp-conventional-changelog');
  return gulp.src('CHANGELOG.md', {})
      .pipe(conventionalChangelog({preset: 'angular', releaseCount: 1}, {
        // Override release version to avoid `v` prefix for git comparison
        // See https://github.com/conventional-changelog/conventional-changelog-core/issues/10
        currentTag: require('./package.json').version
      }))
      .pipe(gulp.dest('./'));
});


// Formatting
gulp.task('lint', function() {
  return gulp.src([PATHS.src])
      .pipe(tslint({configuration: require('./tslint.json'), formatter: 'prose'}))
      .pipe(tslint.report({summarizeFailureOutput: true}));
});

gulp.task('check-format', function() {
  return doCheckFormat().on(
      'warning', function(e) { console.log("NOTE: this will be promoted to an ERROR in the continuous build"); });
});

gulp.task('enforce-format', function() {
  return doCheckFormat().on('warning', function(e) {
    console.log("ERROR: You forgot to run clang-format on your change.");
    console.log("See https://github.com/ng-bootstrap/ng-bootstrap/blob/master/DEVELOPER.md#clang-format");
    process.exit(1);
  });
});

function doCheckFormat() {
  return gulp.src(['gulpfile.js', 'karma-test-shim.js', PATHS.src]).pipe(gulpFormat.checkFormat('file', clangFormat));
}

// Public Tasks
gulp.task('clean', ['clean:build', 'clean:tests', 'clean:demo', 'clean:demo-cache']);

gulp.task('build', function(done) { runSequence('lint', 'enforce-format', 'clean:build', 'ngc', 'npm', done); });

gulp.task('default', function(done) { runSequence('lint', 'enforce-format', 'ddescribe-iit', 'test', done); });