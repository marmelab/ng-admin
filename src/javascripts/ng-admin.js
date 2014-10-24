require.config({
    paths: {
        'angular': 'bower_components/angular/angular',
        'angular-resource': 'bower_components/angular-resource/angular-resource',
        'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
        'angular-route': 'bower_components/angular-route/angular-route',
        'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
        'angular-file-upload': 'bower_components/angular-file-upload/angular-file-upload',
        'lodash': 'bower_components/lodash/dist/lodash.min',
        'text' : 'bower_components/requirejs-text/text',
        'angular-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap.min',
        'angular-bootstrap-tpls': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'restangular': 'bower_components/restangular/dist/restangular',
        'humane': 'bower_components/humane/humane',
        'nprogress': 'bower_components/nprogress/nprogress',
        'textangular': 'bower_components/textAngular/dist/textAngular.min',

        'MainModule': 'ng-admin/Main/MainModule',
        'CrudModule': 'ng-admin/Crud/CrudModule'
    },
    shim: {
        'angular': {
            exports: 'angular'
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
        'angular-file-upload': {
            deps: ['angular']
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
    }
});

define(function(require) {
    "use strict";

    var angular = require('angular');
    require('MainModule');
    require('CrudModule');

    angular.module('ng-admin', ['main', 'crud']);
});
