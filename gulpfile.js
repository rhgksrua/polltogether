/*jslint node: true */
'use strict';

var gulp = require('gulp');
var inj = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var nodemon = require('gulp-nodemon');
var bowerFiles = require('main-bower-files');
var concat = require('gulp-concat');

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
});

gulp.task('concat-js', function() {
    return gulp.src(angularFiles)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./app'));
});

gulp.task('concat-bower', function() {
    return gulp.src(bowerFiles(), {base: './app/bower_components'})
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./app'));
});

gulp.task('inject-bower', function() {
    var target = gulp.src('./app/index.html');
    return target
        .pipe(inj(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
        .pipe(gulp.dest('./app'));
});

/**
 * Concatonates js files
 */
gulp.task('concat', function() {
    console.log('concating ...');
    return gulp.src(angularFiles)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./app'));
});

/**
 * Injects main.js to index.html
 * main.js is the concatonated file from task 'concat'
 */
gulp.task('inject-main', function() {
    console.log('inject-main...');
    var target = gulp.src('./app/index.html');
    var sources = gulp.src('./app/main.js', {read: false});
    return target
        .pipe(inj(sources, {relative: true}))
        .pipe(gulp.dest('./app'));
});

gulp.task('build', ['concat', 'inject-main']);

