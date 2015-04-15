define('angular', [], function () { return angular;});
define('lodash', [], function () { return _; });
define('angular-sanitize', [], function () { return angular.module('ngSanitize'); });
define('angular-resource', [], function () { return angular.module('ngResource');});
define('angular-bootstrap', [], function () { return angular.module('ui.bootstrap');});
define('angular-bootstrap-tpls', [], function () { return angular.module('ui.bootstrap.tpls');});
define('angular-ui-router', [], function () { return angular.module('ui.router'); });
define('ng-file-upload', [], function () { return angular.module('angularFileUpload'); });
define('restangular', [], function () { return angular.module('restangular'); });
define('ngInflection', [], function () { return angular.module('ngInflection'); });
define('inflection', [], function () { return inflection; });
define('humane', [], function () { return humane; });
define('nprogress', [], function () { return NProgress; });
define('numeral', [], function () { return numeral; });
define('textangular', [], function () { return angular.module('textAngular'); });
define('angular-ui-codemirror', [], function () { return angular.module('ui.codemirror'); });
define('angular-numeraljs', [], function () { return angular.module('ngNumeraljs');});
define('papaparse', [], function () { return Papa;});
define('bower_components/codemirror/lib/codemirror', [], function () { return CodeMirror;});
define('bower_components/codemirror/addon/edit/closebrackets', [], function () { return CodeMirror; });
define('bower_components/codemirror/addon/lint/lint', [], function () { return CodeMirror; });
define('bower_components/jsonlint/lib/jsonlint', [], function () { return CodeMirror; });
define('bower_components/codemirror/addon/lint/json-lint', [], function () { return CodeMirror; });
define('bower_components/codemirror/addon/selection/active-line', [], function () { return CodeMirror; });
define('bower_components/codemirror/mode/javascript/javascript', [], function () { return CodeMirror; });

require.config({
    paths: {
        'text' : 'bower_components/requirejs-text/text',
        'MainModule': 'ng-admin/Main/MainModule',
        'CrudModule': 'ng-admin/Crud/CrudModule',
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
