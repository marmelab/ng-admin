module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['requirejs', 'jasmine'],
        browsers: [process.env.CI ? 'PhantomJS' : 'Chrome'],

        files: [
            {pattern: 'src/scripts/bower_components/angular/angular.js', included: false},
            {pattern: 'src/scripts/bower_components/angular-mocks/angular-mocks.js', included: false},

            // ng-admin application files
            {pattern: 'src/scripts/lib/**/*.js', included: false},
            {pattern: 'src/scripts/app/**/component/**/*.js', included: false},
            {pattern: 'src/scripts/app/**/config/**/*.js', included: false},
            {pattern: 'src/scripts/app/**/view/**/*.html', included: false},

            // require configuration files
            'src/scripts/common.js',
            'src/scripts/ng-admin.js',

            // Test files
            {pattern: 'test/unit/**/**/*.js', included: false},
            {pattern: 'test/unit/lib/**/*.js', included: false},
            {pattern: 'test/mock/*.js', included: false},

            // Test bootstrap
            'test/app-test.js'
        ]
    });
};
