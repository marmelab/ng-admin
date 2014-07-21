define(
    [
        'angular',
        'config',

        'app/Crud/component/controller/ListController',
        'app/Crud/component/controller/CreateController',
        'app/Crud/component/controller/EditController',
        'app/Crud/component/controller/DeleteController',


        'app/Crud/component/service/CrudManager',

        'app/Crud/config/routing',

        'angular-ui-router', 'famous-angular', 'angular-sanitize'
    ],
    function (
        angular,
        config,

        ListController,
        CreateController,
        EditController,
        DeleteController,

        CrudManager,

        routing
        ) {
        "use strict";

        var CrudModule = angular.module('crud', ['ui.router', 'ngSanitize', 'famous.angular']);
        CrudModule.constant('config', config);

        CrudModule.controller('ListController', ListController);
        CrudModule.controller('CreateController', CreateController);
        CrudModule.controller('EditController', EditController);
        CrudModule.controller('DeleteController', DeleteController);

        CrudModule.service('CrudManager', CrudManager);

        CrudModule.config(routing);

        return CrudModule;
    }
);
