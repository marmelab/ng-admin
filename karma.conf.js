module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['requirejs', 'jasmine'],
        files: [
            {pattern: 'app/bower_components/**/*.js', included: false},
            {pattern: 'app/bower_components/**/**/*.js', included: false},
            {pattern: 'app/scripts/*.js', included: false},
            {pattern: 'app/scripts/controllers/*.js', included: false},
            {pattern: 'app/scripts/services/*.js', included: false},
            {pattern: 'test/{spec,unit}/**/*.js', included: false},
            {pattern: 'app/views/*.html', watched: true, included: false, served: true},
            'test/main-test.js'


//            'app/bower_components/jquery/dist/jquery.js',
//            'app/bower_components/angular/angular.js',
//            'app/bower_components/angular-mocks/angular-mocks.js',
//            'app/bower_components/angular-resource/angular-resource.js',
//            'app/bower_components/angular-cookies/angular-cookies.js',
//            'app/bower_components/angular-sanitize/angular-sanitize.js',
//            'app/bower_components/angular-route/angular-route.js',
//            'app/bower_components/angular-ui-router/release/angular-ui-router.js',
//            //'app/bower_components/requirejs/require.js',
//            'app/bower_components/famous-angular/dist/famous-angular.js',
//            'app/bower_components/lodash/dist/lodash.compat.js',
//            'app/bower_components/restangular/dist/restangular.js',
//            'app/scripts/*.js',
//            'app/scripts/controllers/*.js',
//            'app/scripts/services/*.js',
//            // 'test/mock/**/*.js',
//            'test/test-main.js',
//            'test/unit/**/*.js'
        ],
        exclude: ['app/scripts/app.js'],
        port: 8080,

        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
        plugins: [
            'karma-jasmine',
            'karma-requirejs',
            'karma-chrome-launcher'
        ],
        // possible values:Chrome, ChromeCanary, Firefox, Opera, Safari (only Mac), PhantomJS, IE (only Windows)
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
