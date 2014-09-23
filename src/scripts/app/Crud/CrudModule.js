define(function (require) {
    "use strict";

    var angular = require('angular'),
        ListController = require('app/Crud/component/controller/ListController'),
        FormController = require('app/Crud/component/controller/FormController'),
        DeleteController = require('app/Crud/component/controller/DeleteController'),

        InfinitePagination = require('app/Crud/component/directive/InfinitePagination'),

        CrudManager = require('app/Crud/component/service/CrudManager'),

        routing = require('app/Crud/config/routing');

    require('angular-ui-router');
    require('angular-sanitize');
    require('angular-bootstrap-tpls');

    var CrudModule = angular.module('crud', ['ui.router', 'ui.bootstrap', 'ngSanitize']);

    CrudModule.controller('ListController', ListController);
    CrudModule.controller('FormController', FormController);
    CrudModule.controller('DeleteController', DeleteController);

    CrudModule.service('CrudManager', CrudManager);

    CrudModule.directive('infinitePagination', InfinitePagination);

    /**
     * Date Picker patch
     * https://github.com/angular-ui/bootstrap/commit/42cc3f269bae020ba17b4dcceb4e5afaf671d49b
     */
    CrudModule.config(function($provide){
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
    });

    CrudModule.config(routing);

    return CrudModule;
});
