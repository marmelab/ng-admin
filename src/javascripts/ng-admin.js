/*global require,define,angular*/

define('angular', [], function () {
    'use strict';

    return angular;
});

require.config({
    paths: {
        'angular-resource': 'bower_components/angular-resource/angular-resource',
        'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
        'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
        'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',
        'ng-file-upload': 'bower_components/ng-file-upload/angular-file-upload',
        'lodash': 'bower_components/lodash/dist/lodash.min',
        'text' : 'bower_components/requirejs-text/text',
        'jquery' : 'bower_components/jquery/dist/jquery',
        'moment' : 'bower_components/moment/min/moment.min',
        'angular-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap.min',
        'angular-bootstrap-tpls': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'restangular': 'bower_components/restangular/dist/restangular',
        'ngInflection': 'bower_components/ngInflection/ngInflection',
        'inflection': 'bower_components/inflection/inflection.min',
        'humane': 'bower_components/humane/humane',
        'nprogress': 'bower_components/nprogress/nprogress',
        'textangular': 'bower_components/textAngular/dist/textAngular.min',
        'angular-ui-codemirror': 'bower_components/angular-ui-codemirror/ui-codemirror.min',
        'bootstrap-datetimepicker': 'bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker',
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
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-datetimepicker': {
            deps: ['bootstrap']
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
