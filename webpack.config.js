var ExtractTextPlugin = require('extract-text-webpack-plugin');

function getEntrySources(sources) {
    if (process.env.NODE_ENV !== 'production') { // for live reload
        sources.push('webpack-dev-server/client?http://0.0.0.0:8000');
    }

    return sources;
}

var ngAdminSources = [
    './src/javascripts/ng-admin.js',
    './src/sass/ng-admin.scss'
];

var ngAdminAndVendorSources = [
    './src/javascripts/ng-admin.js',
    './src/javascripts/vendors.js',
    'font-awesome/scss/font-awesome.scss',
    'bootstrap-sass/assets/stylesheets/_bootstrap.scss',
    'nprogress/nprogress.css',
    'humane-js/themes/flatty.css',
    'textangular/src/textAngular.css',
    'codemirror/lib/codemirror.css',
    'codemirror/addon/lint/lint.css',
    'ui-select/dist/select.css',
    './src/sass/ng-admin.scss'
];

module.exports = {
    entry: {
        'ng-admin': getEntrySources(ngAdminAndVendorSources),
        'ng-admin-only': getEntrySources(ngAdminSources)
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
    stats: {
      children: false,
      hash: false,
      version: false,
      warnings: false,
      errorDetails: true,
    },
};
