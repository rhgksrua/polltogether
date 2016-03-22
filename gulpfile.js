/*jslint node: true */
'use strict';

var gulp = require('gulp');
var inj = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var nodemon = require('gulp-nodemon');
var bowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
var Server = require('karma').Server;

/**
 * Inject order
 *
 * When new files are added, need to include here also.
 */
var angularFiles = [
    './app/app.js',
    './app/app/config.js',
    './app/app/*.js',
    './app/create/create.js',
    './app/create/**/*.js',
    './app/login/login.js',
    './app/login/**/*.js',
    './app/register/register.js',
    './app/register/**/*.js',
    './app/password/password.js',
    './app/password/**/*.js',
    './app/results/results.js',
    './app/results/**/*.js',
    './app/vote/vote.js',
    './app/vote/**/*.js',
    './app/user/user.js',
    './app/user/**/*.js',
    '!./app/bower_components/**/*',
    '!./app/**/*test.js'
];

gulp.task('default', function() {
});

/**
 * Development task.
 * Currently, main.js and index.html are ignored to prevent endless loop
 *
 * When files are changed, the files are concatonated and injected to index.html.
 */
gulp.task('dev', function() {
    nodemon({
        script: 'server.js',
        ext: 'js html',
        tasks: ['concat-js', 'concat-bower'],
        ignore: ['main.js', 'index.html'],
        env: { 
            'NODE_ENV': 'development',
        }
    });
});

gulp.task('develop', function() {
    nodemon({
        script: 'server.js',
        ext: 'js html',
        ignore: ['index.html'],
        env: { 
            'NODE_ENV': 'development',
        }
    });
});

gulp.task('test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('tdd', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        autoWatch: true
    }, done).start();
});

gulp.task('production', function() {
    nodemon({
        script: 'server.js',
        ext: 'js html',
        ignore: ['index.html'],
        env: {
            'NODE_ENV': 'production',
        }
    });
});

gulp.task('bower-files', function() {
    return gulp.src(mainBowerFiles())
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('html', function() {
    return gulp.src('./app/index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('app-js', function() {
    return gulp.src(angularFiles)
        .pipe(concat('app.min.js'))
        .pipe(uglify()) 
        .pipe(gulp.dest('./dist'));
});

gulp.task('concat-bower', function() {
    return gulp.src(bowerFiles(), {base: './app/bower_components'})
        .pipe(concat('libs.min.js'))
        .pip(uglify())
        .pipe(gulp.dest('./app'));
});

gulp.task('inject-bower', function() {
    var target = gulp.src('./app/index.html');
    return target
        .pipe(inj(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
        .pipe(gulp.dest('./app'));
});

/**
 * Injects main.js to index.html
 * main.js is the concatonated file from task 'concat'
 */
gulp.task('inject-app', ['html', 'app-js'], function() {
    var target = gulp.src('./dist/index.html');
    var sources = gulp.src(['./dist/app.min.js'], {read: false});
    return target
        .pipe(inj(sources, {relative: true}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('move-css', function() {
    return gulp.src(['./app/bower_components/**/*.css'], {read: false})
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('inject-bower-css', ['move-css'], function() {
    var target = gulp.src('./dist/index.html');
    var sources = gulp.src(['./dist/css/**/*.css'], {read: false});
    return target
        .pipe(inj(sources, {relative: false, name: 'bower'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('inject-bower', ['bower-files'], function() {
    var target = gulp.src('./dist/index.html');
    var sources = gulp.src(['./dist/libs.min.js'], {read: false});
    return target
        .pipe(inj(sources, {relative: true, name: 'bower'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build',[], function() {
});



