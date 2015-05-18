var ExtractTextPlugin = require('extract-text-webpack-plugin');

var sources = [
    'font-awesome/scss/font-awesome.scss',
    'bootstrap-sass/assets/stylesheets/_bootstrap.scss',
    './src/sass/ng-admin.scss',

    'nprogress/nprogress.css',
    'humane-js/themes/flatty.css',
    'textangular/src/textAngular.css',
    'codemirror/lib/codemirror.css',
    'codemirror/addon/lint/lint.css',

    './src/javascripts/ng-admin.js'
];

if (process.env.NODE_ENV !== 'production') { // for live reload
    sources.push('webpack-dev-server/client?http://localhost:8080');
}

module.exports = {
    entry: {
        'ng-admin': sources
    },
    output: {
        publicPath: "http://localhost:8080/",
        filename: "build/[name].min.js"
    },
    module: {
        loaders: [
            { test: /es6.+\.js$/, loader: 'babel-loader' },
            { test: /\.js/, loader: 'ng-annotate' },
            { test: /\.html$/, loader: 'html' },
            { test: /\.(woff2?|svg|ttf|eot)(\?.*)?$/, loader: 'url' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('css') },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') }
        ]
    },
    plugins: [
        new ExtractTextPlugin('build/ng-admin.min.css', {
            allChunks: true
        })
    ]
};
