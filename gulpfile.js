/*jslint node: true */
'use strict';

var gulp    = require('gulp');
var inj  = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var nodemon = require('gulp-nodemon');
var bowerFiles = require('main-bower-files');
var concat = require('gulp-concat');

/**
 * Inject order
 *
 * @return {undefined}
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
    './app/results/results.js',
    './app/results/**/*.js',
    './app/vote/vote.js',
    './app/vote/**/*.js',
    './app/user/user.js',
    './app/user/**/*.js',
    '!./app/bower_components/**/*',
    '!./app/**/*test.js'
];

gulp.task('develop', function() {
    nodemon({
        script: 'server.js',
        ext: 'js html',
        env: { 
            'NODE_ENV': 'development',
        }
    });
});

gulp.task('inject-bower', function() {
    var target = gulp.src('./app/index.html');
    return target
        .pipe(inj(gulp.src(bowerFiles(), {read: false}), {name: 'bower', relative: true}))
        .pipe(gulp.dest('./app'));
});

gulp.task('inject', function() {
    var target = gulp.src('./app/index.html');

    var sources = gulp.src(angularFiles, {read: false});
    return target
        .pipe(inj(sources, {relative: true}))
        .pipe(gulp.dest('./app'));
});

gulp.task('concat', function() {
    return gulp.src(angularFiles)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./app'));
});

gulp.task('inject-main', function() {
    var target = gulp.src('./app/index.html');

    var sources = gulp.src('./app/main.js', {read: false});
    return target
        .pipe(inj(sources, {relative: true}))
        .pipe(gulp.dest('./app'));
});

gulp.task('build', ['concat', 'inject-main']);

