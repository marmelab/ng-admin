exports.config =  {
    specs: ['e2e/*.js'],
    baseUrl: 'http://localhost:8000',
    maxSessions: 1,
    multiCapabilities: [
        { browserName: 'chrome' }
    ]
};
