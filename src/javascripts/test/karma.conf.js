module.exports = function (config) {
    'use strict';

    // Retrieve a Webpack config specialized in tests
    var webpackConfig = require('../../../webpack.config');
    webpackConfig.context = __dirname + '/../../..';
    delete webpackConfig.entry;
    delete webpackConfig.output;

    config.set({
        basePath: '../',
        browsers: [process.env.CI ? 'PhantomJS' : 'Chrome'],
        frameworks: ['jasmine'],
        files: [
            '../../node_modules/angular/angular.min.js',
            '../../node_modules/angular-mocks/angular-mocks.js',
            '../../node_modules/angular-numeraljs/dist/angular-numeraljs.min.js',
            '../../node_modules/numeral/numeral.js',

            'test/unit/**/*.js'
        ],
        plugins: ['karma-webpack', 'karma-jasmine', 'karma-chrome-launcher', 'karma-phantomjs-launcher', 'karma-babel-preprocessor'],

        //files: [
        //    {pattern: 'bower_components/angular-mocks/angular-mocks.js', included: true},
        //    {pattern: '../../node_modules/angular/angular.js', included: true},
        //    {pattern: '../../node_modules/angular-numeraljs/dist/angular-numeraljs.js', included: true},
        //    {pattern: '../../node_modules/codemirror/lib/codemirror.js', included: true},
        //    {pattern: '../../node_modules/codemirror/addon/edit/closebrackets.js', included: true},
        //    {pattern: '../../node_modules/codemirror/addon/edit/matchbrackets.js', included: true},
        //    {pattern: '../../node_modules/codemirror/addon/lint/json-lint.js', included: true},
        //    {pattern: '../../node_modules/codemirror/addon/lint/lint.js', included: true},
        //    {pattern: '../../node_modules/codemirror/addon/selection/active-line.js', included: true},
        //    {pattern: '../../node_modules/codemirror/mode/javascript/javascript.js', included: true},
        //    {pattern: '../../node_modules/jsonlint/lib/jsonlint.js', included: true},
        //    {pattern: '../../node_modules/numeral/numeral.js', included: true},
        //
        //    // ng-admin application files
        //    {pattern: 'vendors.js', included: true},
        //    {pattern: 'ng-admin/**/**/**/*.js', included: true},
        //    {pattern: 'ng-admin/**/*/*.html', included: true},
        //    {pattern: 'ng-admin/**/view/**/*.html', included: true},
        //    {pattern: 'ng-admin/es6/lib/**/*.js', included: true},
        //    {pattern: 'ng-admin/lib/**/*.js', included: true},
        //    {pattern: 'ng-admin/lib/polyfill/bind.js', included: true},
        //
        //    // Test files
        //    {pattern: 'test/function.bind.shim.js', included: true},
        //    {pattern: 'test/mock/*.js', included: true},
        //    {pattern: 'test/unit/**/**/*.js', included: true},
        //
        //    // Test bootstrap
        //    'test/app-test.js'
        //],
        preprocessors: {
            //'ng-admin/es6/lib/**/*.js': 'babel',
            'test/**/*.js': 'webpack'
        },
        //babelPreprocessor: {
        //    options: {
        //        modules: "amd"
        //    }
        //},
        webpackMiddleware: {
            noInfo: true
        },
        webpack: webpackConfig
    });
};
