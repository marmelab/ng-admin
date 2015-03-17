/*global require,define,angular*/

define('angular', [], function () {
    'use strict';

    return angular;
});

require.config({
    paths: {
        'angular-bootstrap': 'bower_components/angular-bootstrap/ui-bootstrap.min',
        'angular-bootstrap-tpls': 'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angular-numeraljs': 'bower_components/angular-numeraljs/dist/angular-numeraljs',
        'angular-resource': 'bower_components/angular-resource/angular-resource',
        'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
        'angular-ui-codemirror': 'bower_components/angular-ui-codemirror/ui-codemirror.min',
        'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
        'humane': 'bower_components/humane/humane',
        'inflection': 'bower_components/inflection/inflection.min',
        'lodash': 'bower_components/lodash/dist/lodash.min',
        'ng-file-upload': 'bower_components/ng-file-upload/angular-file-upload',
        'ngInflection': 'bower_components/ngInflection/ngInflection',
        'nprogress': 'bower_components/nprogress/nprogress',
        'numeral': 'bower_components/numeral/numeral',
        'restangular': 'bower_components/restangular/dist/restangular',
        'text' : 'bower_components/requirejs-text/text',
        'textangular': 'bower_components/textAngular/dist/textAngular.min',
        'CrudModule': 'ng-admin/Crud/CrudModule',
        'MainModule': 'ng-admin/Main/MainModule',
        'AdminDescription': '../../build/ng-admin-configuration'
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

    var AdminDescription = require('AdminDescription');

    var factory = angular.module('AdminDescriptionModule', []);
    factory.constant('AdminDescription', new AdminDescription());

    var ngadmin = angular.module('ng-admin', ['main', 'crud', 'AdminDescriptionModule']);
    ngadmin.config(function(NgAdminConfigurationProvider, AdminDescription) {
        NgAdminConfigurationProvider.setAdminDescription(AdminDescription);
    });
});
