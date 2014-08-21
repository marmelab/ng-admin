module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['requirejs', 'jasmine'],
        browsers: [process.env.CI ? 'PhantomJS' : 'Chrome'],

        files: [
            {pattern: 'app/scripts/bower_components/angular/angular.js', included: false},
            {pattern: 'app/scripts/bower_components/angular-mocks/angular-mocks.js', included: false},

            // ng-admin application files
            {pattern: 'app/scripts/lib/**/*.js', included: false},
            {pattern: 'app/scripts/app/**/component/**/*.js', included: false},
            {pattern: 'app/scripts/app/**/config/**/*.js', included: false},
            {pattern: 'app/scripts/app/**/view/**/*.html', included: false},

            // require configuration files
            'app/scripts/common.js',
            'app/scripts/common-famous.js',
            'app/scripts/ng-admin.js',

            // Test files
            {pattern: 'test/unit/**/**/*.js', included: false},
            {pattern: 'test/unit/lib/**/*.js', included: false},
            {pattern: 'test/mock/*.js', included: false},

            // Test bootstrap
            'test/app-test.js'
        ]
    });
};
