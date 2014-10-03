// Karma configuration
// Generated on Mon Feb 24 2014 13:43:49 GMT+0000 (GMT Standard Time)

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'public/vendor/jquery/dist/jquery.min.js',
            'public/vendor/angular/angular.js',
            'public/vendor/angular-mocks/angular-mocks.js',
            'public/vendor/lodash/dist/lodash.compat.js',
            'public/vendor/jasmine-jquery/lib/jasmine-jquery.js',
            'public/vendor/bootstrap/dist/js/bootstrap.min.js',
            'public/vendor/peerjs/peer.min.js',
            'public/i18n/angular-locale_en-gb.js',
            'client/app.js',
            'client/**/*.js',
            'test/unit/**/*.spec.js'
        ],

        // list of files to exclude
        exclude: [
        ],

        preprocessors: {
            'client/js/**/*.js': ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'coverage', 'junit'],

        junitReporter: {
            outputFile: 'test/reports/TEST-karma.xml',
            suite: ''
        },

        coverageReporter: {
            type: 'lcov',
            dir: 'test/coverage/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
