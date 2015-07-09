var ExtractTextPlugin = require('extract-text-webpack-plugin');

function getEntrySources(sources) {
    if (process.env.NODE_ENV !== 'production') { // for live reload
        sources.push('webpack-dev-server/client?http://localhost:8080');
    }

    return sources;
}

var ngAdminSources = [
    './src/javascripts/ng-admin.js',
    './src/sass/ng-admin.scss'
];

var vendorSources = [
    './src/javascripts/vendors.js',
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
        'ng-admin': getEntrySources(ngAdminSources.concat(vendorSources)),
        'ng-admin-only': getEntrySources(ngAdminSources),
        'blog-config': getEntrySources([
            './examples/blog/config.js'
        ])
    },
    output: {
        publicPath: "http://localhost:8080/",
        filename: "build/[name].min.js"
    },
    module: {
        loaders: [
            { test: /\.js/, loaders: ['babel'], exclude: /node_modules\/(?!admin-config)/ },
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
    ]
};
