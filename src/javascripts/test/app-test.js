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
        'angular-resource': 'bower_components/angular-resource/angular-resource',
        'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
        'angular-route': 'bower_components/angular-route/angular-route',
        'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
        'lodash': 'bower_components/lodash/dist/lodash.min',
        'text' : 'bower_components/requirejs-text/text',
        'angular-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap.min',
        'angular-bootstrap-tpls': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'restangular': 'bower_components/restangular/dist/restangular',
        'humane': 'bower_components/humane/humane',
        'nprogress': 'bower_components/nprogress/nprogress',

        'MainModule': 'ng-admin/Main/MainModule',
        'CrudModule': 'ng-admin/Crud/CrudModule',

        'NgaConfiguration': 'ng-admin/es6/nga-configuration'
    },
    shim: {
        'angular': {
            exports: 'angular'
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
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
