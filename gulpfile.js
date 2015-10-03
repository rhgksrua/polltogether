/*jslint node: true */
'use strict';

var gulp    = require('gulp');
var inj  = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var nodemon = require('gulp-nodemon');
var bowerFiles = require('main-bower-files');

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


    var sources = gulp.src(angularFiles, {read: false});
    return target
        .pipe(inj(sources, {relative: true}))
        .pipe(gulp.dest('./app'));

});
