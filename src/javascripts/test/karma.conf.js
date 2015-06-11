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
            '../../node_modules/ui-select/dist/select.js',

            'test/function.bind.shim.js',
            'test/unit/**/*.js'
        ],
        plugins: ['karma-webpack', 'karma-jasmine', 'karma-chrome-launcher', 'karma-phantomjs-launcher', 'karma-babel-preprocessor'],
        preprocessors: {
            'test/**/*.js': 'webpack'
        },
        webpackMiddleware: {
            noInfo: true
        },
        webpack: webpackConfig
    });
};
