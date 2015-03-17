module.exports = function (config) {
    'use strict';
    config.set({
        basePath: '../',
        frameworks: ['requirejs', 'jasmine'],
        browsers: [process.env.CI ? 'PhantomJS' : 'Chrome'],
        plugins: ['karma-requirejs', 'karma-jasmine', 'karma-chrome-launcher', 'karma-phantomjs-launcher', 'karma-babel-preprocessor'],

        files: [
            {pattern: 'bower_components/angular-mocks/angular-mocks.js', included: false},
            {pattern: 'bower_components/angular-numeraljs/dist/angular-numeraljs.js', included: false},
            {pattern: 'bower_components/angular/angular.js', included: false},
            {pattern: 'bower_components/codemirror/addon/edit/closebrackets.js', included: false},
            {pattern: 'bower_components/codemirror/addon/edit/matchbrackets.js', included: false},
            {pattern: 'bower_components/codemirror/addon/lint/json-lint.js', included: false},
            {pattern: 'bower_components/codemirror/addon/lint/lint.js', included: false},
            {pattern: 'bower_components/codemirror/addon/selection/active-line.js', included: false},
            {pattern: 'bower_components/codemirror/lib/codemirror.js', included: false},
            {pattern: 'bower_components/codemirror/mode/javascript/javascript.js', included: false},
            {pattern: 'bower_components/jsonlint/lib/jsonlint.js', included: false},
            {pattern: 'bower_components/numeral/numeral.js', included: false},
            {pattern: 'bower_components/requirejs-text/text.js', included: false},

            // ng-admin application files
            {pattern: 'ng-admin/**/**/**/*.js', included: false},
            {pattern: 'ng-admin/**/*/*.html', included: false},
            {pattern: 'ng-admin/**/view/**/*.html', included: false},
            {pattern: 'ng-admin/es6/lib/**/*.js', included: false},
            {pattern: 'ng-admin/lib/**/*.js', included: false},
            {pattern: 'ng-admin/lib/polyfill/bind.js', included: true},

            // Test files
            {pattern: 'test/mock/*.js', included: false},
            {pattern: 'test/unit/**/**/*.js', included: false},

            // Test bootstrap
            'test/app-test.js'
        ],
        preprocessors: {
            'ng-admin/es6/lib/**/*.js': 'babel'
        },
        babelPreprocessor: {
            options: {
                modules: "amd"
            }
        }
    });
};
