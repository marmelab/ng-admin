define(
    [
        'angular',
        'config',

        'app/Crud/component/controller/ListController',
        'app/Crud/component/controller/CreateController',
        'app/Crud/component/controller/EditController',
        'app/Crud/component/controller/DeleteController',

        'angular-ui-router', 'famous-angular'
    ],
    function (
        angular,
        config,

        ListController,
        CreateController,
        EditController,
        DeleteController
        ) {
        "use strict";

        var CrudModule = angular.module('crud', ['ui.router', 'famous.angular']);
        CrudModule.constant('config', config);

        CrudModule.controller('ListController', ListController);
        CrudModule.controller('CreateController', CreateController);
        CrudModule.controller('EditController', EditController);
        CrudModule.controller('DeleteController', DeleteController);

        return CrudModule;
    }
);
