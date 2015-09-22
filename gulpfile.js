/*jslint node: true */
'use strict';

var gulp    = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('develop', function() {
    nodemon({
        script: 'server.js',
        ext: 'js html',
        // need to restart for env to initiate
        env: { 
            'NODE_ENV': 'development',
            'TESTVAR': 'testvar',
            'JWT_PASS': 'supersecret',
            'CONSUMER_KEY': '6U7GhtLYnRwgDARdV7ZYHFa1R',
            'CONSUMER_SECRET': 'qzYLFcyu4evyxatwv7Cehyx6xJzrIqxHRqVm80mtOvxXL3PDqr'
        }
    });
});
