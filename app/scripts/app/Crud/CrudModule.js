define(
    [
        'angular',
        'config',

        'app/Crud/component/controller/ListController',
        'app/Crud/component/controller/CreateController',
        'app/Crud/component/controller/EditController',
        'app/Crud/component/controller/DeleteController',

        'app/Crud/component/directive/InfinitePagination',

        'app/Crud/component/service/CrudManager',

        'app/Crud/config/routing',

        'angular-ui-router', 'angular-sanitize', 'angular-bootstrap-tpls'
    ],
    function (
        angular,
        config,

        ListController,
        CreateController,
        EditController,
        DeleteController,

        InfinitePagination,

        CrudManager,

        routing
        ) {
        "use strict";

        var CrudModule = angular.module('crud', ['ui.router', 'ui.bootstrap', 'ngSanitize']);
        CrudModule.constant('config', config);

        CrudModule.controller('ListController', ListController);
        CrudModule.controller('CreateController', CreateController);
        CrudModule.controller('EditController', EditController);
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
    }
);
