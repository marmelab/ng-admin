var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
    entry: {
        'ng-admin': [
            __dirname + '/src/javascripts/ng-admin.js',
            __dirname + '/src/sass/ng-admin.scss',
        ],
    },
    output: process.env.NODE_ENV === 'test' ? {
        path: './src/javascripts/test/fixtures/examples/blog/',
        filename: "build/[name].min.js"
    } : {
        publicPath: "http://localhost:8000/",
        filename: "build/[name].min.js"
    },
    module: {
        loaders: [
            { test: /\.js/, loaders: ['babel'], include: __dirname + '/src/javascripts' },
            { test: /\/angular\.min\.js$/, loader: 'exports?angular' },
            { test: /\.html$/, loader: 'html' },
            { test: /\.(woff2?|svg|ttf|eot)(\?.*)?$/, loader: 'url' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('css') },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') }
        ]
    },
    resolve: {
        alias: {
            angular: __dirname + '/node_modules/angular/angular.min.js',
        },
    },
    plugins: [
        new ExtractTextPlugin('build/[name].min.css', {
            allChunks: true
        })
    ],
    stats: {
      children: false,
      hash: false,
      version: false,
      warnings: false,
      errorDetails: true,
    }
};
