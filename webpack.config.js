var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ngAdminJsSources = [
    './src/javascripts/ng-admin.js'
];

var ngAdminCssSources = [
    './src/sass/ng-admin.scss'
];

var vendorsJsSources = [
    './src/javascripts/vendors.js'
];

var vendorsCssSources = [
    'font-awesome/scss/font-awesome.scss',
    'bootstrap-sass/assets/stylesheets/_bootstrap.scss',
    'nprogress/nprogress.css',
    'humane-js/themes/flatty.css',
    'textangular/src/textAngular.css',
    'codemirror/lib/codemirror.css',
    'codemirror/addon/lint/lint.css',
    'ui-select/dist/select.css'
 ];

module.exports = {
    entry: {
        'ng-admin': ['angular'].concat(vendorsJsSources.concat(ngAdminJsSources).concat(vendorsCssSources).concat(ngAdminCssSources)),
        'ng-admin-only': ngAdminJsSources.concat(ngAdminCssSources),
        'ng-admin-vendors-js': vendorsJsSources,
        'ng-admin-vendors-css': vendorsCssSources
    },
    output: process.env.NODE_ENV === 'test' ? {
        path: './examples/blog/',
        filename: "build/[name].min.js"
    } : {
        publicPath: "/",
        filename: "build/[name].min.js"
    },
    module: {
        loaders: [
            { test: /\.js/, loaders: ['babel'], exclude: /node_modules[\\\/](?!admin-config)/ },
            { test: /\.js/, loaders: ['ng-annotate'] },
            { test: /\.html$/, loader: 'html' },
            { test: /\.(woff2?|svg|ttf|eot)(\?.*)?$/, loader: 'url' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('css') },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') }
        ]
    },
    plugins: [
        new ExtractTextPlugin('build/[name].min.css', {
            allChunks: true
        })
    ],
};
