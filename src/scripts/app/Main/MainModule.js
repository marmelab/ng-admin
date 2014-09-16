define(
    [
        'angular',
        'config',

        'app/Main/component/controller/AppController',
        'app/Main/component/controller/DashboardController',
        'app/Main/component/controller/SidebarController',

        'app/Main/component/service/PanelBuilder',
        'app/Main/component/service/Validator',

        'app/Main/component/filter/OrderElement',

        'app/Main/config/routing',

        'app/Main/run/Loader',

        'angular-ui-router', 'restangular'
    ],
    function (
        angular,
        config,

        AppController,
        DashboardController,
        SidebarController,

        PanelBuilder,
        Validator,

        OrderElement,

        routing,

        loader
        ) {
        "use strict";

        var MainModule = angular.module('main', ['ui.router', 'restangular']);
        MainModule.constant('config', config);

        MainModule.controller('AppController', AppController);
        MainModule.controller('DashboardController', DashboardController);
        MainModule.controller('SidebarController', SidebarController);

        MainModule.service('PanelBuilder', PanelBuilder);
        MainModule.service('Validator', Validator);

        MainModule.filter('orderElement', OrderElement);

        MainModule.config(routing);

        MainModule.run(loader);

        return MainModule;
    }
);
