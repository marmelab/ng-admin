/*global requirejs,window*/

var tests = [],
    file;

for (file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    paths: {
        'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
        'mixins': '/base/test/mock/mixins',
        'mock/q': '/base/test/mock/q',
        'mock/Restangular': '/base/test/mock/Restangular',

        'angular': 'bower_components/angular/angular',
        'angular-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap.min',
        'angular-bootstrap-tpls': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-numeraljs': 'bower_components/angular-numeraljs/dist/angular-numeraljs',
        'angular-resource': 'bower_components/angular-resource/angular-resource',
        'angular-route': 'bower_components/angular-route/angular-route',
        'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
        'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
        'humane': 'bower_components/humane/humane',
        'lodash': 'bower_components/lodash/dist/lodash.min',
        'nprogress': 'bower_components/nprogress/nprogress',
        'numeral': 'bower_components/numeral/numeral',
        'restangular': 'bower_components/restangular/dist/restangular',
        'text' : 'bower_components/requirejs-text/text',

        'MainModule': 'ng-admin/Main/MainModule',
        'CrudModule': 'ng-admin/Crud/CrudModule'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-numeraljs':  {
            deps: ['angular']
        },
        'angular-mocks':  {
            deps: ['angular']
        },
        'restangular': {
            deps: ['angular', 'lodash']
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'angular-bootstrap': {
            deps: ['angular']
        },
        'angular-bootstrap-tpls': {
            deps: ['angular', 'angular-bootstrap']
        },
        'jquery': {
            exports: '$'
        },
        'angular-resource': {
            deps: ['angular']
        },
        'angular-sanitize': {
            deps: ['angular']
        },
        'angular-route': {
            deps: ['angular']
        },
        'nprogress': {
            exports: 'NProgress'
        },
        'numeral': {
            exports: 'numeral'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
