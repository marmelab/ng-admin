define(function (require) {
    "use strict";

    var angular = require('angular'),
        ListController = require('ng-admin/Crud/component/controller/ListController'),
        FormController = require('ng-admin/Crud/component/controller/FormController'),
        DeleteController = require('ng-admin/Crud/component/controller/DeleteController'),

        InfinitePagination = require('ng-admin/Crud/component/directive/InfinitePagination'),

        CrudManager = require('ng-admin/Crud/component/service/CrudManager'),

        cacheTemplate = require('ng-admin/Crud/run/cacheTemplate'),

        routing = require('ng-admin/Crud/config/routing');

    require('angular-ui-router');
    require('angular-sanitize');
    require('angular-bootstrap-tpls');
    require('textangular');

    var CrudModule = angular.module('crud', ['ui.router', 'ui.bootstrap', 'ngSanitize', 'textAngular']);

    CrudModule.controller('ListController', ListController);
    CrudModule.controller('FormController', FormController);
    CrudModule.controller('DeleteController', DeleteController);

    CrudModule.service('CrudManager', CrudManager);

    CrudModule.directive('infinitePagination', InfinitePagination);

    /**
     * Date Picker patch
     * https://github.com/angular-ui/bootstrap/commit/42cc3f269bae020ba17b4dcceb4e5afaf671d49b
     */
    CrudModule.config(['$provide', function($provide){
        $provide.decorator('dateParser', function($delegate){

            var oldParse = $delegate.parse;
            $delegate.parse = function(input, format) {
                if ( !angular.isString(input) || !format ) {
                    return input;
                }
                return oldParse.apply(this, arguments);
            };

            return $delegate;
        });
    }]);

    CrudModule.run(cacheTemplate);

    CrudModule.config(routing);

    return CrudModule;
});
