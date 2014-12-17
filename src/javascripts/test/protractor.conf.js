exports.config =  {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    specs: ['e2e/*.js'],
    baseUrl: 'http://' + (process.env.CI ? 'ngadmin' : 'localhost') + ':8000',
    maxSessions: 1,
    multiCapabilities: [
        {
            browserName: 'chrome',
            build: process.env.TRAVIS_BUILD_NUMBER ? process.env.TRAVIS_BUILD_NUMBER : null,
            'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER ? process.env.TRAVIS_JOB_NUMBER : null,
            name: 'ng-admin'
        }
    ],

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 360000
    }
};
