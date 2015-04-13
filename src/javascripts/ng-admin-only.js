define('angular', [], function () {
    return angular;
});

define('lodash', [], function () {
    return _;
});

define('angular-sanitize', [], function () {
    return angular.module('ngSanitize');
});

define('angular-resource', [], function () {
    return angular.module('ngResource');
});

define('angular-bootstrap', [], function () {
    return angular.module('ui.bootstrap');
});

define('angular-bootstrap-tpls', [], function () {
    return angular.module('ui.bootstrap.tpls');
});

define('angular-ui-router', [], function () {
    return angular.module('ui.router');
});

define('ng-file-upload', [], function () {
    return angular.module('angularFileUpload');
});

define('restangular', [], function () {
    return angular.module('restangular');
});

define('ngInflection', [], function () {
    return angular.module('ngInflection');
});

define('inflection', [], function () {
    return inflection;
});

define('humane', [], function () {
    return humane;
});

define('nprogress', [], function () {
    return NProgress;
});

define('textangular', [], function () {
    return angular.module('textAngular');
});

define('angular-ui-codemirror', [], function () {
    return angular.module('ui.codemirror');
});

require.config({
    paths: {
        'text' : 'bower_components/requirejs-text/text',
        'MainModule': 'ng-admin/Main/MainModule',
        'CrudModule': 'ng-admin/Crud/CrudModule'
    },
    shim: {
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
        }
    }
});

define(function (require) {
    'use strict';

    var angular = require('angular');
    require('MainModule');
    require('CrudModule');

    angular.module('ng-admin', ['main', 'crud']);
});
