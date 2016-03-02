/*global browser*/
var jsonServer = require('json-server');
var path = require('path');

var server = function() {
    const server = jsonServer.create();

    server.use(jsonServer.defaults({
        static: path.join(__dirname, '/fixtures/examples/blog'),
        logger: false
    }));

    server.listen(8001);

    return server;
}

var beforeLaunch = function () {
    global.server = server();
};

var onPrepare = function () {
    browser.executeScript('window.name = "NG_ENABLE_DEBUG_INFO"');
}

var afterLaunch = function () {
    if (!global.server || !global.server.close) {
        return;
    }

    global.server.close();
};

exports.config =  {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    specs: ['e2e/*.js'],
    baseUrl: 'http://' + (process.env.CI ? 'ngadmin' : 'localhost') + ':8001',
    maxSessions: 1,
    multiCapabilities: [
        {
            browserName: 'chrome',
            build: process.env.TRAVIS_BUILD_NUMBER ? process.env.TRAVIS_BUILD_NUMBER : null,
            'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER ? process.env.TRAVIS_JOB_NUMBER : null,
            name: 'ng-admin'
        }
    ],
    directConnect: !process.env.CI,
    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 360000
    },

    beforeLaunch: beforeLaunch,
    onPrepare: onPrepare,
    afterLaunch: afterLaunch,
};
