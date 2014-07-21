define(
    [
        'angular',
        'config',

        'app/Main/component/controller/AppController',
        'app/Main/component/controller/DashboardController',
        'app/Main/component/controller/SidebarController',

        'app/Main/config/routing',

        'angular-ui-router', 'famous-angular'
    ],
    function (
        angular,
        config,

        AppController,
        DashboardController,
        SidebarController,

        routing
        ) {
        "use strict";

        var MainModule = angular.module('main', ['ui.router']);
        MainModule.constant('config', config);

        MainModule.controller('AppController', AppController);
        MainModule.controller('DashboardController', DashboardController);
        MainModule.controller('SidebarController', SidebarController);

        MainModule.config(routing);

        return MainModule;
    }
);
