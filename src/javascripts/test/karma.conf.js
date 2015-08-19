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
            '../../node_modules/angular/angular.js',
            '../../node_modules/angular-bootstrap/ui-bootstrap.min.js',
            '../../node_modules/angular-bootstrap/ui-bootstrap-tpls.min.js',
            '../../node_modules/angular-mocks/angular-mocks.js',
            '../../node_modules/angular-numeraljs/dist/angular-numeraljs.min.js',
            '../../node_modules/numeral/numeral.js',
            '../../node_modules/ui-select/dist/select.js',

            'ng-admin.js',
            'test/function.bind.shim.js',
            'test/unit/**/*.js'
        ],
        plugins: ['karma-webpack', 'karma-jasmine', 'karma-chrome-launcher', 'karma-phantomjs-launcher'],
        preprocessors: {
            'ng-admin.js': 'webpack',
            'test/**/*.js': 'webpack'
        },
        webpackMiddleware: {
            noInfo: true,
            devtool: 'inline-source-map' //just do inline source maps instead of the default
        },
        webpack: webpackConfig
    });
};
