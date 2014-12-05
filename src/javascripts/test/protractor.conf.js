exports.config =  {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    specs: ['e2e/*.js'],
    baseUrl: 'http://' + (process.env.CI ? 'ngadmin' : 'localhost') + ':8000',
    maxSessions: 1,
    multiCapabilities: [
        { browserName: 'chrome' }
    ],

    onPrepare: function() {
        //browser.driver.setContext('sauce:job-name=ng-admin')
    },

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: true,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 360000
    },
};
