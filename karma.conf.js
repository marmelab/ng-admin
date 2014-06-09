module.exports = function(config) {
    config.set({
        basePath: 'app/',
        frameworks: ['requirejs', 'jasmine'],
        files: [
            {pattern: 'bower_components/jquery/dist/jquery.js', included: false},
            {pattern: 'bower_components/bootstrap/dist/js/bootstrap.js', included: false},
            {pattern: 'bower_components/humane/humane.js', included: false},
            {pattern: 'bower_components/angular/angular.js', included: false},
            {pattern: 'bower_components/angular-mocks/angular-mocks.js', included: false},
            {pattern: 'bower_components/angular-resource/angular-resource.js', included: false},
            {pattern: 'bower_components/angular-cookies/angular-cookies.js', included: false},
            {pattern: 'bower_components/angular-sanitize/angular-sanitize.js', included: false},
            {pattern: 'bower_components/angular-route/angular-route.js', included: false},
            {pattern: 'bower_components/angular-ui-router/release/angular-ui-router.js', included: false},
            {pattern: 'bower_components/lodash/dist/lodash.js', included: false},
            {pattern: 'bower_components/famous-angular/dist/famous-angular.js', included: false},
            {pattern: 'bower_components/restangular/dist/restangular.js', included: false},
            {pattern: 'bower_components/famous/dist/famous.js', included: false},
            {pattern: 'bower_components/famous/**/*.js', included: false},

            {pattern: 'scripts/app.js', included: false},
            {pattern: 'scripts/init.js', included: false},
            {pattern: 'scripts/controllers/*.js', included: false},
            {pattern: 'scripts/services/*.js', included: false},

            {pattern: '../test/unit/**/*.js', included: false},

            '../test/main-test.js',
            // Delay the starting of karma until $famous provider is declared
            '../test/karma-start.js'
        ],
        exclude: ['app/scripts/main.js', 'app/scripts/init.js'],

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
