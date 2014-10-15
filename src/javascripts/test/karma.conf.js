module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['requirejs', 'jasmine'],
        browsers: [process.env.CI ? 'PhantomJS' : 'Chrome'],
        plugins: ['karma-requirejs', 'karma-jasmine', 'karma-chrome-launcher', 'karma-phantomjs-launcher'],

        files: [
            {pattern: 'bower_components/angular/angular.js', included: false},
            {pattern: 'bower_components/angular-mocks/angular-mocks.js', included: false},

            // ng-admin application files
            {pattern: 'ng-admin/**/**/**/*.js', included: false},
            {pattern: 'ng-admin/lib/**/*.js', included: false},
            {pattern: 'ng-admin/**/view/**/*.html', included: false},

            // Test files
            {pattern: 'test/unit/**/**/*.js', included: false},
            {pattern: 'test/mock/*.js', included: false},

            // Test bootstrap
            'test/app-test.js'
        ]
    });
};
