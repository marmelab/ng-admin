var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src/scripts',

    paths: {
        'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
        'mixins': '/base/test/mock/mixins',
        'mock/q': '/base/test/mock/q',
        'mock/Restangular': '/base/test/mock/Restangular'
    },
    shim: {
        'angular-mocks': ['angular']
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
